import SwiftUI

/// Root content view - handles navigation based on app state
struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @State private var deepLinkSlyde: DeepLink?

    var body: some View {
        NavigationStack {
            DiscoveryFeedView()
                .onOpenURL { url in
                    handleDeepLink(url)
                }
        }
    }

    private func handleDeepLink(_ url: URL) {
        if let link = DeepLink.parse(url: url) {
            deepLinkSlyde = link
        }
    }
}

/// Deep link types for Universal Links
enum DeepLink {
    case home(slug: String)
    case slyde(slug: String, slydeId: String)
    case frame(slug: String, slydeId: String, frameIndex: Int)

    /// Parse a URL into a DeepLink
    /// Supports: slydes.io/{slug}, slydes.io/{slug}/{slydeId}, slydes.io/{slug}/{slydeId}?frame=2
    static func parse(url: URL) -> DeepLink? {
        let pathComponents = url.pathComponents.filter { $0 != "/" }

        guard let slug = pathComponents.first else { return nil }

        // Check for frame query param
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let frameIndex = components?.queryItems?.first(where: { $0.name == "frame" })?.value.flatMap(Int.init)

        if pathComponents.count == 1 {
            return .home(slug: slug)
        }

        if pathComponents.count >= 2 {
            let slydeId = pathComponents[1]
            if let frameIndex = frameIndex {
                return .frame(slug: slug, slydeId: slydeId, frameIndex: frameIndex)
            }
            return .slyde(slug: slug, slydeId: slydeId)
        }

        return nil
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}
