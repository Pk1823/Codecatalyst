import { Platform, Text, TextInput } from "react-native";

/**
 * Resolves the appropriate Google Sans or JetBrains Mono font family
 * based on the element's style properties.
 */
export function resolveTypographyFont(style: any): string {
  if (!style) return "GoogleSans-Regular";

  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style;

  // Check if monospace is explicitly requested
  const fam = flatStyle.fontFamily;
  if (
    fam &&
    (fam.includes("mono") ||
      fam.includes("Mono") ||
      fam.includes("Menlo") ||
      fam.includes("monospace") ||
      fam.includes("JetBrains"))
  ) {
    const isBold =
      flatStyle.fontWeight === "700" ||
      flatStyle.fontWeight === "800" ||
      flatStyle.fontWeight === "900" ||
      flatStyle.fontWeight === "bold";
    return isBold ? "JetBrainsMono-Bold" : "JetBrainsMono-Regular";
  }

  // Check weight hierarchy for Google Sans
  const weight = flatStyle.fontWeight;
  if (
    weight === "700" ||
    weight === "800" ||
    weight === "900" ||
    weight === "bold"
  ) {
    return "GoogleSans-Bold";
  }
  if (weight === "600") {
    return "GoogleSans-SemiBold";
  }
  if (weight === "500") {
    return "GoogleSans-Medium";
  }

  return "GoogleSans-Regular";
}

/**
 * Globally guarantees that Google Sans and JetBrains Mono fonts are applied
 * across every single route, screen, and component in the mobile app.
 */
export function setupGlobalFonts() {
  // 1. Web Environment: Inject comprehensive CSS rules for React Native Web
  if (Platform.OS === "web" && typeof document !== "undefined") {
    const styleId = "missionwell-global-google-sans-font";
    if (!document.getElementById(styleId)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=JetBrains+Mono:wght@400..700&display=swap";
      document.head.appendChild(link);

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap');

        /* Explicit font-family aliases for local/asset names used in React Native styles */
        @font-face {
          font-family: 'GoogleSans-Regular';
          src: local('Google Sans'), local('GoogleSans-Regular');
          font-weight: 400;
        }
        @font-face {
          font-family: 'GoogleSans-Medium';
          src: local('Google Sans Medium'), local('GoogleSans-Medium');
          font-weight: 500;
        }
        @font-face {
          font-family: 'GoogleSans-SemiBold';
          src: local('Google Sans SemiBold'), local('GoogleSans-SemiBold');
          font-weight: 600;
        }
        @font-face {
          font-family: 'GoogleSans-Bold';
          src: local('Google Sans Bold'), local('GoogleSans-Bold');
          font-weight: 700;
        }
        @font-face {
          font-family: 'JetBrainsMono-Regular';
          src: local('JetBrains Mono'), local('JetBrainsMono-Regular');
          font-weight: 400;
        }
        @font-face {
          font-family: 'JetBrainsMono-Bold';
          src: local('JetBrains Mono Bold'), local('JetBrainsMono-Bold');
          font-weight: 700;
        }

        /* Target all text elements across all routes in React Native Web */
        html, body, div, span, p, h1, h2, h3, h4, h5, h6, input, textarea, select, button,
        .css-text-146c3p1, .r-fontFamily-1qd0xha, [class*="r-fontFamily-"], [data-testid] {
          font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        /* Attribute selectors ensuring styles mapped to GoogleSans fonts render properly */
        [style*="GoogleSans-Bold"], .r-fontFamily-GoogleSans-Bold {
          font-family: 'Google Sans', sans-serif !important;
          font-weight: 700 !important;
        }
        [style*="GoogleSans-SemiBold"], .r-fontFamily-GoogleSans-SemiBold {
          font-family: 'Google Sans', sans-serif !important;
          font-weight: 600 !important;
        }
        [style*="GoogleSans-Medium"], .r-fontFamily-GoogleSans-Medium {
          font-family: 'Google Sans', sans-serif !important;
          font-weight: 500 !important;
        }
        [style*="GoogleSans-Regular"], .r-fontFamily-GoogleSans-Regular {
          font-family: 'Google Sans', sans-serif !important;
          font-weight: 400 !important;
        }

        /* Monospace elements for code, hashes, tickers, badges across all routes */
        code, pre, .font-mono, [data-font-mono="true"], .mono, [style*="monospace"], [style*="JetBrains"], [class*="JetBrains"] {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        }
        [style*="JetBrainsMono-Bold"], .r-fontFamily-JetBrainsMono-Bold {
          font-family: 'JetBrains Mono', monospace !important;
          font-weight: 700 !important;
        }
        [style*="JetBrainsMono-Regular"], .r-fontFamily-JetBrainsMono-Regular {
          font-family: 'JetBrains Mono', monospace !important;
          font-weight: 400 !important;
        /* Responsive Mobile Viewport Frame for Desktop Browsers */
        @media (min-width: 501px) {
          html {
            background-color: #060911 !important;
            height: 100% !important;
          }
          body {
            background-color: #060911 !important;
            background: radial-gradient(circle at 50% 10%, #17233d 0%, #060911 85%) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 16px 0 !important;
            box-sizing: border-box !important;
          }
          #root {
            width: 100% !important;
            max-width: 430px !important;
            height: 94vh !important;
            max-height: 900px !important;
            min-height: 680px !important;
            margin: auto !important;
            border-radius: 46px !important;
            overflow: hidden !important;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85),
                        0 0 0 8px #1e293b,
                        0 0 0 10px #334155,
                        0 0 35px rgba(37, 99, 235, 0.12) !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            background-color: #090D16 !important;
          }
          /* Realistic Dynamic Island / Notch Pill */
          #root::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 105px;
            height: 24px;
            background-color: #000000;
            border-radius: 20px;
            z-index: 99999;
            pointer-events: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
          }
        }
        @media (max-width: 500px) {
          html, body, #root {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 2. React Native Component Rendering Engine: Patch Text.render
  try {
    const textTarget = Text as any;
    if (textTarget && typeof textTarget.render === "function" && !textTarget.render.__mwPatched) {
      const origTextRender = textTarget.render;
      function patchedTextRender(this: any, props: any, ref: any) {
        const fontName = resolveTypographyFont(props && props.style);
        const enhancedProps = {
          ...props,
          style: [{ fontFamily: fontName }, props && props.style],
        };
        return origTextRender.call(this, enhancedProps, ref);
      }
      patchedTextRender.__mwPatched = true;
      textTarget.render = patchedTextRender;
    }
  } catch {
    // Ignore if environment prevents monkey patching
  }

  // 3. React Native Component Rendering Engine: Patch TextInput.render
  try {
    const inputTarget = TextInput as any;
    if (inputTarget && typeof inputTarget.render === "function" && !inputTarget.render.__mwPatched) {
      const origInputRender = inputTarget.render;
      function patchedInputRender(this: any, props: any, ref: any) {
        const fontName = resolveTypographyFont(props && props.style);
        const enhancedProps = {
          ...props,
          style: [{ fontFamily: fontName }, props && props.style],
        };
        return origInputRender.call(this, enhancedProps, ref);
      }
      patchedInputRender.__mwPatched = true;
      inputTarget.render = patchedInputRender;
    }
  } catch {
    // Ignore if environment prevents monkey patching
  }

  // 4. DefaultProps Fallback for Native Components
  try {
    if ((Text as any).defaultProps == null) {
      (Text as any).defaultProps = {};
    }
    (Text as any).defaultProps.style = {
      fontFamily: "GoogleSans-Regular",
      ...((Text as any).defaultProps.style || {}),
    };

    if ((TextInput as any).defaultProps == null) {
      (TextInput as any).defaultProps = {};
    }
    (TextInput as any).defaultProps.style = {
      fontFamily: "GoogleSans-Regular",
      ...((TextInput as any).defaultProps.style || {}),
    };
  } catch {
    // Ignore
  }
}
