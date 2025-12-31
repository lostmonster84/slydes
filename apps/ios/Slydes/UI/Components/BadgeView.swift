import SwiftUI

/// Badge pill displayed on frames
struct BadgeView: View {
    let text: String

    var body: some View {
        Text(text)
            .font(SlydesTypography.caption1.weight(.semibold))
            .foregroundStyle(.white)
            .padding(.horizontal, SlydesSpacing.sm)
            .padding(.vertical, SlydesSpacing.xxs)
            .background(.ultraThinMaterial)
            .clipShape(Capsule())
    }
}

#Preview {
    ZStack {
        Color.black
        BadgeView(text: "New Experience")
    }
}
