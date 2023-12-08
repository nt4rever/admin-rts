import DevTools from "@/components/Devtools/Devtools";
import { config } from "@/libs/react-query-config";
import { CacheProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import "simplebar-react/dist/simplebar.min.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@/theme/global.scss";
import { ModalsProvider } from "@mantine/modals";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>RTS Admin</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MantineProvider>
          <ModalsProvider>
            <Notifications position="top-center" zIndex={9999} />
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <AuthProvider>
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {getLayout(<Component {...pageProps} />)}
                  </ThemeProvider>
                </AuthProvider>
                <DevTools />
              </Hydrate>
            </QueryClientProvider>
          </ModalsProvider>
        </MantineProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default appWithTranslation(App);
