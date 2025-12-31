import SwiftUI

/// Call-to-action button on frames
struct CTAButtonView: View {
    let text: String
    let type: CTAType?
    let action: String?
    let accentColor: String?
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: SlydesSpacing.xs) {
                // Icon based on type
                if let icon = iconForType {
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .semibold))
                }

                Text(text)
                    .font(SlydesTypography.callout.weight(.semibold))
            }
            .foregroundStyle(.white)
            .padding(.horizontal, SlydesSpacing.md)
            .padding(.vertical, SlydesSpacing.sm)
            .background(
                LinearGradient(
                    colors: [SlydesColors.leaderBlue, SlydesColors.electricCyan],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .clipShape(Capsule())
            .shadow(color: .black.opacity(0.3), radius: 8, x: 0, y: 4)
        }
    }

    private var iconForType: String? {
        switch type {
        case .call: return "phone.fill"
        case .email: return "envelope.fill"
        case .link: return "arrow.up.right"
        case .directions: return "location.fill"
        case .info: return "info.circle.fill"
        case .faq: return "questionmark.circle.fill"
        case .reviews: return "star.fill"
        case .frame: return "arrow.right"
        case .list: return "list.bullet"
        case .none: return nil
        }
    }
}

#Preview {
    ZStack {
        Color.black
        VStack(spacing: 16) {
            CTAButtonView(text: "Book Now", type: .link, action: nil, accentColor: nil) {}
            CTAButtonView(text: "Call Us", type: .call, action: nil, accentColor: nil) {}
            CTAButtonView(text: "Get Directions", type: .directions, action: nil, accentColor: nil) {}
        }
    }
}
