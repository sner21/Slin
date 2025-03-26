import { ConfigProvider, theme } from "antd"
import StartView from "./view/battle/StartView"
import themeConfig from "./config/theme";

function App() {
  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: themeConfig.globalAcColor,
        colorBorder: themeConfig.globalAcColor,
      },
      components: {
        Segmented: {
          colorBgLayout: themeConfig.globalBgColor,
          itemSelectedBg: themeConfig.globalAcColor,
          trackPadding: 0
        },
        Input: {
          activeBorderColor: themeConfig.globalAcColor,
        },
      }
    }}>
      <StartView>
      </StartView></ConfigProvider>
  )

}

export default App