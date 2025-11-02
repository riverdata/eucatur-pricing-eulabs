import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import "./assets/styles/index.scss";

export const themeScss = {
    font: {
        family: getComputedStyle(document.documentElement).getPropertyValue("--font-family-base").trim(),
        color: getComputedStyle(document.documentElement).getPropertyValue("--color-text").trim(),
    },
    color: {
        primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
        error: getComputedStyle(document.documentElement).getPropertyValue("--color-error").trim(),
        background: getComputedStyle(document.documentElement).getPropertyValue("--color-background").trim(),
    },
    Seatcolor: {
        default: getComputedStyle(document.documentElement).getPropertyValue("--color-default").trim(),
        woman: getComputedStyle(document.documentElement).getPropertyValue("--color-woman").trim(),
        panoramic: getComputedStyle(document.documentElement).getPropertyValue("--color-panoramic").trim(),
        comfort: getComputedStyle(document.documentElement).getPropertyValue("--color-comfort").trim(),
        economic: getComputedStyle(document.documentElement).getPropertyValue("--color-economic").trim(),
        dark: {
            default: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
            woman: getComputedStyle(document.documentElement).getPropertyValue("--color-woman-dark").trim(),
            panoramic: getComputedStyle(document.documentElement).getPropertyValue("--color-panoramic-dark").trim(),
            comfort: getComputedStyle(document.documentElement).getPropertyValue("--color-comfort-dark").trim(),
            economic: getComputedStyle(document.documentElement).getPropertyValue("--color-economic-dark").trim()
        }
    },
    input: {
        borderTranspartent: getComputedStyle(document.documentElement).getPropertyValue("--input-border-color-transparent").trim(),
        borderColor: getComputedStyle(document.documentElement).getPropertyValue("--input-border-color").trim(),
        borderColorFocus: getComputedStyle(document.documentElement).getPropertyValue("--input-border-color-focus").trim(),
        bgColor: getComputedStyle(document.documentElement).getPropertyValue("--input-bg-color").trim(),
        color: getComputedStyle(document.documentElement).getPropertyValue("--input-text-color").trim()
    },
    button: {
        default: {
            borderRadius: getComputedStyle(document.documentElement).getPropertyValue("--button-border-radius").trim(),
            bgColor: getComputedStyle(document.documentElement).getPropertyValue("--button-bg-color").trim(),
            bgColorSecundary: getComputedStyle(document.documentElement).getPropertyValue("--button-bg-color-secundary").trim(),
            color: getComputedStyle(document.documentElement).getPropertyValue("--button-text-color").trim(),
            colorSecundary: getComputedStyle(document.documentElement).getPropertyValue("--button-text-color-secundary").trim()
        },
        menu: {
            borderRadius: getComputedStyle(document.documentElement).getPropertyValue("--button-menu-border-radius").trim(),
            bgColor: getComputedStyle(document.documentElement).getPropertyValue("--button-menu-bg-color").trim(),
            color: getComputedStyle(document.documentElement).getPropertyValue("--button-menu-text-color").trim()
        }

    },
    modal: {
        borderRadius: getComputedStyle(document.documentElement).getPropertyValue("--modal-boder-radius").trim(),
        boxShadow: getComputedStyle(document.documentElement).getPropertyValue("--modal-box-shadow").trim(),
        bgColor: getComputedStyle(document.documentElement).getPropertyValue("--modal-bg-bolor").trim(),
    },
    backgroundFilled: getComputedStyle(document.documentElement).getPropertyValue("--background-filled").trim(),
    backgroundFocus: getComputedStyle(document.documentElement).getPropertyValue("--background-focus").trim(),
};

export const theme = responsiveFontSizes(createTheme({
    typography: {
        fontFamily: themeScss.font.family,
        body1: {
            fontSize: "0.875rem",
            color: "#585858 !important",
        },
        body2: {
            fontSize: "1rem",
            color: "#585858 !important",
        },
        subtitle1: {
            fontSize: '1.563rem',
            fontWeight: 'bold !important',
            lineHeight: 1.5,
            color: `${themeScss.color.primary} !important`
        },
        subtitle2: {
            fontSize: '1.2rem',
            fontWeight: 'bold !important',
            lineHeight: 1.5,
            color: `${themeScss.color.primary} !important`
        },
        h1: {
            color: '#333333 !important'
        },
        h2: {
            color: '#333333 !important'
        },
        h3: {
            color: '#333333 !important'
        },
        h4: {
            color: '#333333 !important'
        },
        h5: {
            color: '#333333 !important'
        },
        h6: {
            color: '#333333 !important'
        }
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    color: themeScss.font.color
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    color: '#BFBFBF',
                    borderRadius: '1rem'
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    backgroundColor: themeScss.button.default.bgColor,
                    borderRadius: themeScss.button.default.borderRadius,
                    color: themeScss.button.default.color,
                    fontSize: '0.75rem'
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: themeScss.input.bgColor,
                    borderRadius: '6px',
                    borderColor: themeScss.color.error,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeScss.color.primary,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeScss.color.primary,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeScss.color.primary,
                    },
                },
                input: {
                    fontFamily: 'Roboto',
                    padding: '14px 14px',
                    color: themeScss.input.color,
                    borderColor: themeScss.color.error,
                },

            }
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    backgroundColor: themeScss.input.bgColor,
                    borderRadius: '6px',
                    borderColor: themeScss.color.error,
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: themeScss.input.bgColor,
                    borderRadius: '6px',
                    borderColor: themeScss.color.error,
                },
                input: {
                    fontFamily: 'Roboto',
                    padding: '14px 14px',
                    color: themeScss.input.color,
                    borderColor: themeScss.color.error,
                },

            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: themeScss.input.borderTranspartent,
                    },
                    '& .MuiOutlinedInput-root': {
                        borderColor: themeScss.input.borderColorFocus,
                        '&:hover fieldset': {
                            borderColor: themeScss.input.borderColorFocus,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: themeScss.input.borderColorFocus
                        },
                    }
                },
                input: {
                    fontFamily: 'Roboto',
                    padding: '14px 14px',
                    color: themeScss.input.color,
                    borderColor: themeScss.color.error,
                },

            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                },
                indicator: {
                    backgroundColor: themeScss.color.primary,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: themeScss.color.primary,
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: themeScss.color.primary, // Cor principal do Slider
                    height: 3, // Altura da trilha do Slider
                },
                thumb: {
                    backgroundColor: "#fff", // Cor do thumb (botão do slider)
                    border: "2px solid " + themeScss.color.primary, // Borda ao redor do thumb
                    width: 16, // Largura do thumb
                    height: 16, // Altura do thumb
                },
                track: {
                    backgroundColor: themeScss.color.primary, // Cor da trilha preenchida
                    height: 3, // Altura da trilha preenchida
                },
                rail: {
                    backgroundColor: "#ccc", // Cor da trilha não preenchida
                    height: 3, // Altura da trilha não preenchida
                },
                mark: {
                    backgroundColor: themeScss.color.primary, // Cor das marcas
                    height: 3,
                    width: 2,
                },
                markLabel: {
                    color: themeScss.color.primary, // Cor do texto das marcas
                },
                valueLabel: {
                    backgroundColor: themeScss.color.primary, // Cor de fundo do valor exibido
                    color: "#fff", // Cor do texto do valor
                },
            },
        },
        // @ts-ignore
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        color: "#FFFFFF",
                        backgroundColor: themeScss.color.primary
                    },
                    "&:focus.Mui-selected": {
                        color: "#FFFFFF",
                        backgroundColor: themeScss.color.primary
                    },
                    "&:hover": {
                        color: "#FFFFFF",
                        backgroundColor: themeScss.color.error
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: themeScss.color.primary,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '8px 4px',

                },
            }
        }
    },
}));
