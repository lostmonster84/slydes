import SwiftUI

/// Vertical action stack on the right side of frames
/// Matches web SocialActionStack component
struct SocialActionStackView: View {
    let heartCount: Int
    let isHearted: Bool
    let onHeart: () -> Void
    let onShare: () -> Void
    let onInfo: () -> Void
    let onConnect: () -> Void
    let onVideo: (() -> Void)?

    var body: some View {
        VStack(spacing: SlydesSpacing.md) {
            // Heart button
            ActionButton(
                icon: isHearted ? "heart.fill" : "heart",
                count: heartCount,
                isActive: isHearted,
                activeColor: .red,
                action: onHeart
            )

            // Share button
            ActionButton(
                icon: "square.and.arrow.up",
                action: onShare
            )

            // Connect button (social links)
            ActionButton(
                icon: "at",
                action: onConnect
            )

            // Info button
            ActionButton(
                icon: "info.circle",
                action: onInfo
            )

            // Video button (if demo video exists)
            if let onVideo = onVideo {
                ActionButton(
                    icon: "play.rectangle",
                    action: onVideo
                )
            }
        }
    }
}

/// Individual action button
struct ActionButton: View {
    let icon: String
    var count: Int? = nil
    var isActive: Bool = false
    var activeColor: Color = SlydesColors.leaderBlue
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Image(systemName: icon)
                    .font(.system(size: 24, weight: .medium))
                    .foregroundStyle(isActive ? activeColor : .white)

                if let count = count, count > 0 {
                    Text(formatCount(count))
                        .font(SlydesTypography.caption2)
                        .foregroundStyle(.white.opacity(0.8))
                }
            }
            .frame(width: 44, height: 44)
        }
        .buttonStyle(ScaleButtonStyle())
    }

    private func formatCount(_ count: Int) -> String {
        if count >= 1000000 {
            return String(format: "%.1fM", Double(count) / 1000000)
        } else if count >= 1000 {
            return String(format: "%.1fK", Double(count) / 1000)
        }
        return "\(count)"
    }
}

/// Button style with scale animation
struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.9 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

#Preview {
    ZStack {
        Color.black
        HStack {
            Spacer()
            SocialActionStackView(
                heartCount: 1234,
                isHearted: true,
                onHeart: {},
                onShare: {},
                onInfo: {},
                onConnect: {},
                onVideo: {}
            )
            .padding()
        }
    }
}
