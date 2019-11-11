import * as React from 'react'
import { Box, Header, Segment } from '@stardust-ui/react'

interface PrototypeSectionProps {
  title?: React.ReactNode
  styles?: React.CSSProperties
}

interface ComponentPrototypeProps extends PrototypeSectionProps {
  description?: React.ReactNode
}

export const PrototypeSection: React.FunctionComponent<ComponentPrototypeProps> = props => {
  const { title, children, styles, ...rest } = props
  return (
    <Box styles={{ padding: '1em', margin: "1em", borderTop: "1px solid #ddd", ...styles, }} {...rest}>
      {title && <Header color="green" align="center" as="h2">{title}</Header>}
      {children}
    </Box>
  )
}

export const ComponentPrototype: React.FunctionComponent<ComponentPrototypeProps> = props => {
  const { description, title: header, children, styles, ...rest } = props
  return (
    <Box styles={{ padding: '2em', ...styles }} {...rest}>
      {(header || description) && (
        <Segment>
          {header && <Header as="h3">{header}</Header>}
          {description && <p>{description}</p>}
        </Segment>
      )}
      <Segment>
        {children}
      </Segment>
    </Box>
  )
}