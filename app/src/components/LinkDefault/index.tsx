import { forwardRef } from "react"
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export interface LinkProps {
  link: string,
  children: any,
  text?: string,
  id?: string
}
const linkD = {
  fontSize: '12px',
  fontWeight: '400',
  lineHeight: '20px',
  letterSpacing: '0.3px',
  textAlign: 'right',
  color: '#1A1A1A'

}
const LinkDefault = forwardRef<HTMLParagraphElement, LinkProps>(
  ({ link, text, id, children }, ref) => {
    return (
      <Typography
        sx={linkD}
        id={id}>
        {text}
        <Link id={`${id}_link`} to={`${link}`} >
          {children}
        </Link>
      </Typography >
    )
  }
)
LinkDefault.displayName = "Link"

export { LinkDefault }
