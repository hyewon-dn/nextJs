"use client";

import React from "react";
import StyledComponentsRegistry from "@/lib/styledComponentRegistry";
import { ThemeProvider } from "styled-components";
import theme from "@/style/theme";
// import GlobalStyles from "@/style/GlobalStyles";

export default function StyledComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme.LIGHT_MODE}>
        {/* <GlobalStyles /> */}

        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
