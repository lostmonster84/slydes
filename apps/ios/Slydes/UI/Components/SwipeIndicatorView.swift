import SwiftUI

/// Swipe up indicator with frame count
struct SwipeIndicatorView: View {
    let currentIndex: Int
    let total: Int

    var body: some View {
        HStack(spacing: SlydesSpacing.xxs) {
            Image(systemName: "chevron.up")
                .font(.system(size: 12, weight: .semibold))

            if total > 1 {
                // Progress dots
                HStack(spacing: 4) {
                    ForEach(0..<total, id: \.self) { index in
                        Circle()
                            .fill(index == currentIndex ? Color.white : Color.white.opacity(0.4))
                            .frame(width: 6, height: 6)
                    }
                }
            }
        }
        .foregroundStyle(.white.opacity(0.6))
        .padding(.top, SlydesSpacing.xs)
    }
}

#Preview {
    ZStack {
        Color.black
        VStack(spacing: 24) {
            SwipeIndicatorView(currentIndex: 0, total: 5)
            SwipeIndicatorView(currentIndex: 2, total: 5)
            SwipeIndicatorView(currentIndex: 4, total: 5)
        }
    }
}
