from fastapi import FastAPI, HTTPException, Query
from typing import Optional
from datetime import date, datetime
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestRegressor
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

# Montar a string de conexão
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASS")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_DATABASE")

app = FastAPI()

def get_database_connection():
    # Conexão com o banco de dados
    connection_string = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    engine = create_engine(connection_string)
    return engine


# Função para obter descrições de origem e destino da tb_precificacao
def obter_descricao_origem_destino(linha):
    engine = get_database_connection()
    query = f"""
        SELECT "OrigemDescricao", "DestinoDescricao" 
        FROM tb_precificacao 
        WHERE linha_agencia = '{linha}' 
        LIMIT 1
    """
    df = pd.read_sql(query, engine)
    if not df.empty:
        return df['OrigemDescricao'].iloc[0], df['DestinoDescricao'].iloc[0]
    return None, None

# Função para carregar dados do banco de dados para uma 'linha' específica
def carregar_dados(linha):
    engine = get_database_connection()
    query = f"SELECT * FROM tb_lambdas_calculados WHERE linha_agencia = '{linha}'"
    df = pd.read_sql(query, engine)
    if df.empty:
        return df
    df['Data'] = pd.to_datetime(df['Data'])
    df.set_index('Data', inplace=True)
    return df

# Função auxiliar para prever valores de lambda usando RandomForest
def prever_para_data_especifica(df, data_previsao, tarifa_base, hora=None, antecedencia=None):
    data_previsao = pd.to_datetime(data_previsao)
    ultima_data = df.index.max()
    dias_a_prever = (data_previsao - ultima_data).days

    if dias_a_prever <= 0:
        raise ValueError("A data de previsão deve ser futura em relação à última data da base.")

    previsoes = {}
    colunas_fixas = ['Lambda_Ocupacao', 'Lambda_Demanda', 'Lambda_Trecho', 'Lambda_Linha', 
                     'Lambda_Categoria', 'Lambda_Canal_De_Venda', 'Lambda_Poltrona']

    if hora is not None:
        coluna_hora = f'Lambda_{hora}h'
        colunas_fixas.append(coluna_hora)
        
    if antecedencia is not None:
        coluna_antecedencia = f'Lambda_{antecedencia}dias'
        colunas_fixas.append(coluna_antecedencia)

    for column in colunas_fixas:
        if column not in df.columns:
            # Caso a coluna não exista, pular
            continue

        y = df[column].ffill().bfill().values
        if np.isnan(y).any():
            raise ValueError(f"A coluna {column} ainda contém valores NaN após preenchimento.")

        X = np.arange(len(y)).reshape(-1, 1)
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)

        future_X = np.arange(len(y), len(y) + dias_a_prever).reshape(-1, 1)
        future_forecast = model.predict(future_X)
        previsoes[column] = future_forecast[-1]

    if len(previsoes) == 0:
        raise ValueError("Não foi possível gerar previsões. Verifique se as colunas necessárias existem no dataset.")

    previsoes_df = pd.DataFrame(list(previsoes.items()), columns=['Lambda', 'Valor'])
    lambda_final = previsoes_df['Valor'].sum() + 1

    preco_polt_conv = tarifa_base * (lambda_final + 0.0)
    preco_polt_exec = tarifa_base * (lambda_final + 0.03)
    preco_polt_leito = tarifa_base * (lambda_final + 0.25)
    preco_polt_leito_conj = tarifa_base * (lambda_final + 0.20)
    preco_polt_mulher = tarifa_base * (lambda_final + 0.08)
    preco_polt_conf = tarifa_base * (lambda_final + 0.10)
    preco_polt_panor = tarifa_base * (lambda_final + 0.15)

    precos = {
        'Poltrona Convencional': preco_polt_conv,
        'Poltrona Executiva': preco_polt_exec,
        'Poltrona Leito': preco_polt_leito,
        'Poltrona Leito Conjugado': preco_polt_leito_conj,
        'Poltrona Mulher': preco_polt_mulher,
        'Poltrona Conforto': preco_polt_conf,
        'Poltrona Panorâmica': preco_polt_panor
    }

    return previsoes_df, lambda_final, precos

# Função auxiliar para ajustar o ano, tratando anos bissextos
def ajustar_ano(data, ano_destino):
    try:
        return data.replace(year=ano_destino)
    except ValueError:
        # Caso seja 29 de fevereiro e o ano não seja bissexto
        if data.month == 2 and data.day == 29:
            return data.replace(year=ano_destino, day=28)
        else:
            raise

# Função para obter dados de vendas da tb_precificacao
# def obter_dados_vendas(linha, data_inicial, data_final):
#     engine = get_database_connection()
#     query = f"""
#         SELECT "VendaData", "VendaHora", "PoltronasVendidas"
#         FROM tb_precificacao
#         WHERE linha_agencia = '{linha}' AND "VendaData" BETWEEN '{data_inicial}' AND '{data_final}'
#     """
#     df = pd.read_sql(query, engine)
#     if df.empty:
#         return df
#     df['VendaDataHora'] = pd.to_datetime(df['VendaData'] + ' ' + df['VendaHora'])
#     df['QuantidadePoltronasVendidas'] = df['PoltronasVendidas'].apply(lambda x: len(str(x).split(',')) if pd.notnull(x) else 0)
#     return df

# Função para calcular vendas acumuladas
def calcular_vendas_acumuladas(df_vendas, tarifa):
    df_vendas = df_vendas.sort_values('VendaDataHora')
    df_vendas['TarifaAplicada'] = tarifa
    df_vendas['ValorVenda'] = df_vendas['QuantidadePoltronasVendidas'] * df_vendas['TarifaAplicada']
    df_vendas['VendaAcumulada'] = df_vendas['ValorVenda'].cumsum()
    return df_vendas

@app.get("/")
def listar():
    return "Precificação Python"

class PrevisaoRequest(BaseModel):
    linha: str
    data_previsao: date
    hora_compra: int = 12
    dias_antecedencia: int = 7
    origem: Optional[str] = None
    destino: Optional[str] = None
    tarifa_base: float = 100.0
    route_km: Optional[float] = None

@app.post("/previsao")
def obter_previsao(request: PrevisaoRequest):
    # Carrega os dados da linha
    df = carregar_dados(request.linha)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"Nenhum dado encontrado para a linha {request.linha}.")

    # Se origem e destino não forem fornecidos, obtem do banco
    # if origem is None or destino is None:
    #     origem_descricao, destino_descricao = obter_descricao_origem_destino(linha)
    #     if origem is None:
    #         origem = origem_descricao
    #     if destino is None:
    #         destino = destino_descricao

    # Previsão de preços
    try:
        previsoes_df, lambda_final, precos = prever_para_data_especifica(
            df, request.data_previsao, request.tarifa_base, hora=request.hora_compra, antecedencia=request.dias_antecedencia
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


    # Cálculo de RPKM
    if request.route_km is not None and request.route_km > 0:
        km = pd.to_numeric(request.route_km)
    else:
        km = 1

    if km <= 0 or km is None or np.isnan(km):
        km = 1
    # # Cálculo de RPKM
    # if (origem, destino) in quilometragens:
    #     km = float(quilometragens[(origem, destino)])
    # else:
    #     km = 1

    # if km <= 0 or np.isnan(km):
    #     km = 1

    poltronas_compradas = 1
    rpkm_values = {tipo: (preco * poltronas_compradas / km) for tipo, preco in precos.items()}

    # Obter dados de vendas do ano anterior
    # data_inicial = (pd.to_datetime(request.data_previsao) - pd.DateOffset(years=1)).strftime('%Y-%m-%d')
    # data_final = data_inicial
    # df_vendas = obter_dados_vendas(request.linha, data_inicial, data_final)

    # vendas_base = None
    # vendas_dinamico = None
    # comparativo = None

    # if not df_vendas.empty:
    #     # Ajusta o ano das vendas para o ano atual
    #     df_vendas['VendaDataHora'] = df_vendas['VendaDataHora'].apply(lambda x: ajustar_ano(x, pd.to_datetime(request.data_previsao).year))

    #     # Vendas acumuladas com tarifa base
    #     df_vendas_base = calcular_vendas_acumuladas(df_vendas.copy(), request.tarifa_base)

    #     # Vendas acumuladas com preço dinâmico (exemplo: Poltrona Convencional)
    #     preco_dinamico = precos['Poltrona Convencional']
    #     df_vendas_dinamico = calcular_vendas_acumuladas(df_vendas.copy(), preco_dinamico)

    #     vendas_base = df_vendas_base[['VendaDataHora', 'VendaAcumulada']].to_dict(orient='records')
    #     vendas_dinamico = df_vendas_dinamico[['VendaDataHora', 'VendaAcumulada']].to_dict(orient='records')

    #     venda_acumulada_base = df_vendas_base['VendaAcumulada'].iloc[-1]
    #     venda_acumulada_dinamico = df_vendas_dinamico['VendaAcumulada'].iloc[-1]

    #     comparativo = {
    #         "venda_acumulada_base": float(venda_acumulada_base),
    #         "venda_acumulada_dinamico": float(venda_acumulada_dinamico)
    #     }

    # Retorna resposta em JSON
    resposta = {
        "linha": request.linha,
        "data_previsao": request.data_previsao.strftime("%Y-%m-%d"),
        "hora_compra": request.hora_compra,
        "dias_antecedencia": request.dias_antecedencia,
        "origem": request.origem,
        "destino": request.destino,
        "tarifa_base": request.tarifa_base,
        "lambda_final": lambda_final,
        "precos": {k: float(v) for k,v in precos.items()},
        "rpkm_values": {k: float(v) for k,v in rpkm_values.items()},
        # "vendas_base": vendas_base,
        # "vendas_dinamico": vendas_dinamico,
        # "comparativo": comparativo,
        'previsoes_df': previsoes_df,
        'route_km': request.route_km
    }

    return resposta