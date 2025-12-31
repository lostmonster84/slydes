import SwiftUI

/// Connect sheet showing social media links
struct ConnectSheetView: View {
    let social: SocialLinks?

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: SlydesSpacing.lg) {
                if let social = social {
                    VStack(spacing: SlydesSpacing.sm) {
                        if let instagram = social.instagram {
                            SocialLinkButton(
                                platform: .instagram,
                                handle: instagram
                            )
                        }

                        if let tiktok = social.tiktok {
                            SocialLinkButton(
                                platform: .tiktok,
                                handle: tiktok
                            )
                        }

                        if let facebook = social.facebook {
                            SocialLinkButton(
                                platform: .facebook,
                                handle: facebook
                            )
                        }

                        if let youtube = social.youtube {
                            SocialLinkButton(
                                platform: .youtube,
                                handle: youtube
                            )
                        }

                        if let twitter = social.twitter {
                            SocialLinkButton(
                                platform: .twitter,
                                handle: twitter
                            )
                        }

                        if let linkedin = social.linkedin {
                            SocialLinkButton(
                                platform: .linkedin,
                                handle: linkedin
                            )
                        }
                    }
                } else {
                    ContentUnavailableView(
                        "No Social Links",
                        systemImage: "at.circle",
                        description: Text("This business hasn't added social links yet.")
                    )
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Connect")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}

/// Social platform definition
enum SocialPlatform {
    case instagram, tiktok, facebook, youtube, twitter, linkedin

    var name: String {
        switch self {
        case .instagram: return "Instagram"
        case .tiktok: return "TikTok"
        case .facebook: return "Facebook"
        case .youtube: return "YouTube"
        case .twitter: return "X (Twitter)"
        case .linkedin: return "LinkedIn"
        }
    }

    var icon: String {
        // Using SF Symbols approximations
        switch self {
        case .instagram: return "camera"
        case .tiktok: return "music.note"
        case .facebook: return "person.2"
        case .youtube: return "play.rectangle"
        case .twitter: return "at"
        case .linkedin: return "briefcase"
        }
    }

    var color: Color {
        switch self {
        case .instagram: return Color(red: 0.88, green: 0.19, blue: 0.42)
        case .tiktok: return .black
        case .facebook: return Color(red: 0.23, green: 0.35, blue: 0.6)
        case .youtube: return .red
        case .twitter: return .black
        case .linkedin: return Color(red: 0.0, green: 0.47, blue: 0.71)
        }
    }

    func url(for handle: String) -> URL? {
        // Handle can be a full URL or just a username
        if handle.hasPrefix("http") {
            return URL(string: handle)
        }

        let cleanHandle = handle.replacingOccurrences(of: "@", with: "")

        switch self {
        case .instagram: return URL(string: "https://instagram.com/\(cleanHandle)")
        case .tiktok: return URL(string: "https://tiktok.com/@\(cleanHandle)")
        case .facebook: return URL(string: "https://facebook.com/\(cleanHandle)")
        case .youtube: return URL(string: "https://youtube.com/@\(cleanHandle)")
        case .twitter: return URL(string: "https://twitter.com/\(cleanHandle)")
        case .linkedin: return URL(string: "https://linkedin.com/in/\(cleanHandle)")
        }
    }
}

/// Social link button
struct SocialLinkButton: View {
    let platform: SocialPlatform
    let handle: String

    var body: some View {
        Button {
            if let url = platform.url(for: handle) {
                UIApplication.shared.open(url)
            }
        } label: {
            HStack {
                Image(systemName: platform.icon)
                    .font(.title3)
                    .foregroundStyle(platform.color)
                    .frame(width: 32)

                VStack(alignment: .leading) {
                    Text(platform.name)
                        .font(SlydesTypography.callout.weight(.medium))
                    Text("@\(handle.replacingOccurrences(of: "@", with: ""))")
                        .font(SlydesTypography.caption1)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Image(systemName: "arrow.up.right")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .padding(SlydesSpacing.md)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.md))
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    ConnectSheetView(
        social: SocialLinks(
            instagram: "wildtrax",
            tiktok: "wildtrax",
            facebook: "wildtrax",
            youtube: "wildtrax",
            twitter: nil,
            linkedin: nil
        )
    )
}
