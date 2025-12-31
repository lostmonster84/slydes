import SwiftUI
import AVKit
import WebKit

/// Full-screen video player overlay for demo videos
/// Supports YouTube, Vimeo, and direct video URLs
struct VideoPlayerOverlayView: View {
    let urlString: String
    let onDismiss: () -> Void

    @State private var player: AVPlayer?

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            // Video content
            videoContent

            // Close button
            VStack {
                HStack {
                    Spacer()
                    Button(action: onDismiss) {
                        Image(systemName: "xmark")
                            .font(.title2.weight(.semibold))
                            .foregroundStyle(.white)
                            .padding(SlydesSpacing.sm)
                            .background(.ultraThinMaterial.opacity(0.8))
                            .clipShape(Circle())
                    }
                    .padding()
                }
                Spacer()
            }
        }
        .onDisappear {
            player?.pause()
        }
    }

    @ViewBuilder
    private var videoContent: some View {
        let parsed = parseVideoUrl(urlString)

        switch parsed {
        case .youtube(let videoId):
            YouTubePlayerView(videoId: videoId)
        case .vimeo(let videoId):
            VimeoPlayerView(videoId: videoId)
        case .direct(let url):
            if let url = url {
                NativeVideoPlayer(url: url, player: $player)
            } else {
                Text("Unable to load video")
                    .foregroundStyle(.white)
            }
        case .unknown:
            Text("Unsupported video format")
                .foregroundStyle(.white)
        }
    }

    // MARK: - URL Parsing

    enum ParsedVideoUrl {
        case youtube(videoId: String)
        case vimeo(videoId: String)
        case direct(url: URL?)
        case unknown
    }

    private func parseVideoUrl(_ urlString: String) -> ParsedVideoUrl {
        guard let url = URL(string: urlString) else {
            return .unknown
        }

        let host = url.host?.lowercased() ?? ""

        // YouTube
        if host.contains("youtube.com") || host.contains("youtu.be") {
            if let videoId = extractYouTubeId(from: url) {
                return .youtube(videoId: videoId)
            }
        }

        // Vimeo
        if host.contains("vimeo.com") {
            if let videoId = extractVimeoId(from: url) {
                return .vimeo(videoId: videoId)
            }
        }

        // Cloudflare Stream or direct video
        if urlString.contains(".m3u8") || urlString.contains(".mp4") ||
           host.contains("cloudflarestream.com") {
            return .direct(url: url)
        }

        // Unknown - try as direct URL
        return .direct(url: url)
    }

    private func extractYouTubeId(from url: URL) -> String? {
        // youtu.be/VIDEO_ID
        if url.host?.contains("youtu.be") == true {
            return url.pathComponents.last
        }

        // youtube.com/watch?v=VIDEO_ID
        if let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
           let videoId = components.queryItems?.first(where: { $0.name == "v" })?.value {
            return videoId
        }

        // youtube.com/embed/VIDEO_ID
        if url.pathComponents.contains("embed"),
           let index = url.pathComponents.firstIndex(of: "embed"),
           index + 1 < url.pathComponents.count {
            return url.pathComponents[index + 1]
        }

        return nil
    }

    private func extractVimeoId(from url: URL) -> String? {
        // vimeo.com/VIDEO_ID
        return url.pathComponents.last
    }
}

/// Native AVPlayer for direct video URLs
struct NativeVideoPlayer: View {
    let url: URL
    @Binding var player: AVPlayer?

    var body: some View {
        VideoPlayer(player: player)
            .onAppear {
                player = AVPlayer(url: url)
                player?.play()
            }
    }
}

/// YouTube embed via WKWebView
struct YouTubePlayerView: UIViewRepresentable {
    let videoId: String

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.scrollView.isScrollEnabled = false
        webView.backgroundColor = .black
        webView.isOpaque = false

        let embedHtml = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                * { margin: 0; padding: 0; }
                html, body { width: 100%; height: 100%; background: black; }
                iframe { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
            <iframe
                src="https://www.youtube.com/embed/\(videoId)?autoplay=1&playsinline=1&rel=0"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>
        </body>
        </html>
        """

        webView.loadHTMLString(embedHtml, baseURL: nil)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

/// Vimeo embed via WKWebView
struct VimeoPlayerView: UIViewRepresentable {
    let videoId: String

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.scrollView.isScrollEnabled = false
        webView.backgroundColor = .black
        webView.isOpaque = false

        let embedHtml = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                * { margin: 0; padding: 0; }
                html, body { width: 100%; height: 100%; background: black; }
                iframe { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
            <iframe
                src="https://player.vimeo.com/video/\(videoId)?autoplay=1&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowfullscreen>
            </iframe>
        </body>
        </html>
        """

        webView.loadHTMLString(embedHtml, baseURL: nil)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

#Preview {
    VideoPlayerOverlayView(urlString: "https://www.youtube.com/watch?v=dQw4w9WgXcQ") {
        print("Dismissed")
    }
}
