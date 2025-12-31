import SwiftUI

/// Info sheet showing business details and FAQs
struct InfoSheetView: View {
    let business: BusinessInfo?
    let faqs: [FAQItem]

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: SlydesSpacing.lg) {
                    // Business header
                    if let business = business {
                        BusinessHeaderView(business: business)
                    }

                    // About section
                    if let about = business?.about, !about.isEmpty {
                        VStack(alignment: .leading, spacing: SlydesSpacing.xs) {
                            Text("About")
                                .font(SlydesTypography.headline)

                            Text(about)
                                .font(SlydesTypography.body)
                                .foregroundStyle(.secondary)
                        }
                    }

                    // FAQs
                    if !faqs.isEmpty {
                        VStack(alignment: .leading, spacing: SlydesSpacing.sm) {
                            Text("FAQs")
                                .font(SlydesTypography.headline)

                            ForEach(faqs) { faq in
                                FAQItemView(faq: faq)
                            }
                        }
                    }

                    // Contact
                    if let contact = business?.contact {
                        ContactSection(contact: contact)
                    }
                }
                .padding()
            }
            .navigationTitle("Info")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}

/// Business header with logo, name, rating
struct BusinessHeaderView: View {
    let business: BusinessInfo

    var body: some View {
        HStack(spacing: SlydesSpacing.md) {
            // Logo placeholder
            Circle()
                .fill(Color(hex: business.accentColor))
                .frame(width: 60, height: 60)
                .overlay {
                    Text(String(business.name.prefix(1)))
                        .font(SlydesTypography.title2)
                        .foregroundStyle(.white)
                }

            VStack(alignment: .leading, spacing: SlydesSpacing.xxs) {
                Text(business.name)
                    .font(SlydesTypography.title3)

                if !business.location.isEmpty {
                    Text(business.location)
                        .font(SlydesTypography.subheadline)
                        .foregroundStyle(.secondary)
                }

                if business.rating > 0 {
                    HStack(spacing: 4) {
                        Image(systemName: "star.fill")
                            .foregroundStyle(.yellow)
                        Text(String(format: "%.1f", business.rating))
                        Text("(\(business.reviewCount) reviews)")
                            .foregroundStyle(.secondary)
                    }
                    .font(SlydesTypography.subheadline)
                }
            }
        }
    }
}

/// Expandable FAQ item
struct FAQItemView: View {
    let faq: FAQItem

    @State private var isExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: SlydesSpacing.xs) {
            Button {
                withAnimation(.spring(response: 0.3)) {
                    isExpanded.toggle()
                }
            } label: {
                HStack {
                    Text(faq.question)
                        .font(SlydesTypography.callout.weight(.medium))
                        .foregroundStyle(.primary)
                        .multilineTextAlignment(.leading)

                    Spacer()

                    Image(systemName: "chevron.down")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .rotationEffect(.degrees(isExpanded ? 180 : 0))
                }
            }

            if isExpanded {
                Text(faq.answer)
                    .font(SlydesTypography.body)
                    .foregroundStyle(.secondary)
                    .padding(.top, SlydesSpacing.xxs)
            }
        }
        .padding(SlydesSpacing.md)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.md))
    }
}

/// Contact section with action buttons
struct ContactSection: View {
    let contact: ContactInfo

    var body: some View {
        VStack(alignment: .leading, spacing: SlydesSpacing.sm) {
            Text("Contact")
                .font(SlydesTypography.headline)

            VStack(spacing: SlydesSpacing.xs) {
                if let phone = contact.phone {
                    ContactButton(icon: "phone.fill", label: phone, action: "tel:\(phone)")
                }

                if let email = contact.email {
                    ContactButton(icon: "envelope.fill", label: email, action: "mailto:\(email)")
                }

                if let website = contact.website {
                    ContactButton(icon: "globe", label: website, action: website)
                }

                if let whatsapp = contact.whatsapp {
                    ContactButton(icon: "message.fill", label: "WhatsApp", action: "https://wa.me/\(whatsapp)")
                }
            }
        }
    }
}

/// Contact action button
struct ContactButton: View {
    let icon: String
    let label: String
    let action: String

    var body: some View {
        Button {
            if let url = URL(string: action) {
                UIApplication.shared.open(url)
            }
        } label: {
            HStack {
                Image(systemName: icon)
                    .frame(width: 24)
                Text(label)
                Spacer()
                Image(systemName: "arrow.up.right")
                    .font(.caption)
            }
            .padding(SlydesSpacing.md)
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.md))
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    InfoSheetView(
        business: BusinessInfo(
            id: "1",
            name: "Wild Trax",
            tagline: "Adventure Awaits",
            location: "Scottish Highlands",
            rating: 4.9,
            reviewCount: 127,
            credentials: [],
            about: "Experience the Scottish Highlands like never before with our fleet of Land Rover Defenders and rooftop camping.",
            highlights: nil,
            contact: ContactInfo(
                phone: "+44 7123 456789",
                email: "hello@wildtrax.co.uk",
                website: "https://wildtrax.co.uk",
                whatsapp: "447123456789"
            ),
            social: SocialLinks(
                instagram: "wildtrax",
                tiktok: nil,
                facebook: nil,
                youtube: nil,
                twitter: nil,
                linkedin: nil
            ),
            image: nil,
            accentColor: "2563EB"
        ),
        faqs: [
            FAQItem(id: "1", question: "Do I need previous off-road experience?", answer: "No! Our vehicles are automatic and we provide full training before your adventure begins.", views: nil, clicks: nil, createdAt: nil, updatedAt: nil, published: true),
            FAQItem(id: "2", question: "What's included in the rental?", answer: "Everything you need: vehicle, rooftop tent, bedding, cooking equipment, and adventure kit.", views: nil, clicks: nil, createdAt: nil, updatedAt: nil, published: true)
        ]
    )
}
