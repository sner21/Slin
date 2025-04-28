import { ConfigProvider, theme } from "antd"
import StartView from "./view/battle/StartView"
import themeConfig from "./config/theme";
import { DialogProvider } from './components/DialogManager';

function App() {

  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: themeConfig.globalAcColor,
        colorBorder: themeConfig.globalAcColor,
        borderRadius:0,
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
      
      <DialogProvider>
        <StartView />
      </DialogProvider>
      </ConfigProvider>
  )

}

export default App