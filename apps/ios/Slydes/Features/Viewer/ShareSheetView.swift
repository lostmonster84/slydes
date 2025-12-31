import SwiftUI

/// Share sheet for sharing Slydes
struct ShareSheetView: View {
    let slyde: Slyde
    let frameIndex: Int

    @Environment(\.dismiss) private var dismiss

    private var shareUrl: URL {
        // TODO: Use actual domain from config
        let baseUrl = "https://slydes.io"
        // For now, construct URL from slyde data
        // Format: slydes.io/{orgSlug}/{slydePublicId}?frame={frameIndex}
        var urlString = "\(baseUrl)/\(slyde.publicId)"
        if frameIndex > 0 {
            urlString += "?frame=\(frameIndex + 1)"
        }
        return URL(string: urlString) ?? URL(string: baseUrl)!
    }

    var body: some View {
        ShareLink(item: shareUrl) {
            Label("Share Slyde", systemImage: "square.and.arrow.up")
        }
    }
}

/// Native share sheet presenter
struct ShareSheetPresenter: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ShareSheetView(
        slyde: Slyde(
            id: UUID(),
            organizationId: UUID(),
            publicId: "demo",
            title: "Demo",
            description: nil,
            icon: nil,
            orderIndex: 0,
            published: true,
            hasInventory: nil,
            inventoryCtaText: nil,
            coverBackgroundType: nil,
            coverBackgroundSrc: nil,
            coverVideoFilter: nil,
            coverVideoVignette: nil,
            coverVideoSpeed: nil,
            frames: nil
        ),
        frameIndex: 0
    )
}
