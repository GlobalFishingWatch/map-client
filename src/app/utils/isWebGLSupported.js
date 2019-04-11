// https://github.com/pixijs/pixi.js/blob/d2a83b3fc457f6b0bd41dc5ca268fe1a05b4b50a/packages/utils/src/browser/isWebGLSupported.js

export default function isWebGLSupported() {
  const contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true }

  try {
    if (!window.WebGLRenderingContext) {
      return false
    }

    const canvas = document.createElement('canvas')
    let gl =
      canvas.getContext('webgl', contextOptions) ||
      canvas.getContext('experimental-webgl', contextOptions)

    const success = !!(gl && gl.getContextAttributes().stencil)

    if (gl) {
      const loseContext = gl.getExtension('WEBGL_lose_context')

      if (loseContext) {
        loseContext.loseContext()
      }
    }

    gl = null
    return success
  } catch (e) {
    return false
  }
}
