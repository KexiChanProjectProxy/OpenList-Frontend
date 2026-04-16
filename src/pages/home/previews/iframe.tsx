import { BoxWithFullScreen } from "~/components"
import { objStore } from "~/store"
import { Icon, hope } from "@hope-ui/solid"
import { convertURL, hoverColor } from "~/utils"
import { Component, createMemo } from "solid-js"
import { useLink } from "~/hooks"
import { TbExternalLink } from "solid-icons/tb"

const isExternalPDFJS = (scheme: string) =>
  /https?:\/\/res\.oplist\.org(?:\.cn)?\/pdf\.js\/web\/viewer\.html/i.test(
    scheme,
  )

const isPrivateNetworkHost = (hostname: string) => {
  const h = hostname.toLowerCase()
  return (
    h === "localhost" ||
    h === "::1" ||
    h.endsWith(".local") ||
    h === "0.0.0.0" ||
    h.startsWith("127.") ||
    h.startsWith("10.") ||
    h.startsWith("192.168.") ||
    h.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(h) ||
    h.startsWith("fc") ||
    h.startsWith("fd")
  )
}

const shouldBypassExternalPDFJS = (urlStr: string) => {
  try {
    const url = new URL(urlStr, location.href)
    // External HTTPS PDF.js viewer cannot safely fetch local/private HTTP resources.
    return url.protocol === "http:" || isPrivateNetworkHost(url.hostname)
  } catch {
    return false
  }
}

const IframePreview = (props: { scheme: string }) => {
  const { currentObjLink } = useLink()
  const iframeSrc = createMemo(() => {
    const directURL = currentObjLink(true)
    if (isExternalPDFJS(props.scheme) && shouldBypassExternalPDFJS(directURL)) {
      return directURL
    }
    return convertURL(props.scheme, {
      raw_url: objStore.raw_url,
      name: objStore.obj.name,
      d_url: directURL,
      ts: true,
    })
  })
  return (
    <BoxWithFullScreen w="$full" h="70vh">
      <hope.iframe w="$full" h="$full" src={iframeSrc()} />
      <Icon
        pos="absolute"
        right="$2"
        bottom="$10"
        aria-label="Open in new tab"
        as={TbExternalLink}
        onClick={() => {
          window.open(iframeSrc(), "_blank")
        }}
        cursor="pointer"
        rounded="$md"
        bgColor={hoverColor()}
        p="$1"
        boxSize="$7"
      />
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
