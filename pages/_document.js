import { Children } from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { AppRegistry } from "react-native-web";

// CSS styles for the document
const style = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    // Register the main app component
    AppRegistry.registerComponent("main", () => Main);
    const { getStyleElement } = AppRegistry.getApplication("main");

    // Render the page
    const page = await renderPage();
    
    // Return the page along with the styles
    return { ...page, styles: [
      <style
        key="react-native-style"
        dangerouslySetInnerHTML={{ __html: style }}
      />,
      getStyleElement(),
    ] };
  }

  render() {
    return (
      <Html style={{ height: "100%" }}>
        <Head>
          {/* You can add any additional head elements here */}
        </Head>
        <body style={{ height: "100%", overflow: "hidden" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
