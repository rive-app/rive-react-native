import { ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { ReactNode } from 'react';

export function StyledLink({
  href,
  children,
}: {
  // to do
  href: any;
  children: ReactNode;
}) {
  return (
    <Link style={styles.button} href={href}>
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledLink href="/(examples)/Simple">Simple</StyledLink>
      <StyledLink href="/(examples)/Http">HTTP</StyledLink>
      <StyledLink href="/(examples)/MeshExample">Mesh Example</StyledLink>
      <StyledLink href="/(examples)/Layout">Layout</StyledLink>
      <StyledLink href="/(examples)/ResponsiveLayout">
        Responsive Layout
      </StyledLink>
      <StyledLink href="/(examples)/SimpleControls">Simple Controls</StyledLink>
      <StyledLink href="/(examples)/MultipleArtboards">
        Multiple Artboards
      </StyledLink>
      <StyledLink href="/(examples)/StateMachine">State Machine</StyledLink>
      <StyledLink href="/(examples)/Events">Events</StyledLink>
      <StyledLink href="/(examples)/DynamicText">Dynamic Text</StyledLink>
      <StyledLink href="/(examples)/OutOfBandAssets">
        Out Of Band Assets
      </StyledLink>
      <StyledLink href="/(examples)/NestedDynamicText">
        Nested Dynamic Text
      </StyledLink>
      <StyledLink href="/(examples)/NestedInputs">Nested Inputs</StyledLink>
      <StyledLink href="/(examples)/ErrorNotHandled">
        Error Not Handled
      </StyledLink>
      <StyledLink href="/(examples)/ErrorHandledManually">
        Error Handled Manually
      </StyledLink>
      <StyledLink href="/(examples)/SourceProp">SourceProp</StyledLink>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6221ea',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minWidth: 300,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
