import SwiftUI
import CoreLocation

/// Discovery feed - location-based business discovery
/// Vertical scroll of business Slydes
struct DiscoveryFeedView: View {
    @StateObject private var viewModel = DiscoveryViewModel()

    var body: some View {
        ZStack {
            if viewModel.isLoading && viewModel.organizations.isEmpty {
                LoadingView()
            } else if viewModel.organizations.isEmpty {
                EmptyStateView(
                    title: "No Experiences Found",
                    message: "We couldn't find any experiences near you. Try expanding your search area.",
                    systemImage: "map"
                )
            } else {
                ScrollView(.vertical, showsIndicators: false) {
                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.organizations) { org in
                            OrganizationCardView(organization: org)
                                .frame(height: UIScreen.main.bounds.height)
                        }
                    }
                }
                .scrollTargetBehavior(.paging)
            }
        }
        .task {
            await viewModel.loadOrganizations()
        }
    }
}

/// Discovery view model
@MainActor
class DiscoveryViewModel: ObservableObject {
    @Published var organizations: [Organization] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let supabaseService = SupabaseService.shared
    private let locationManager = LocationManager()

    func loadOrganizations() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Get user location if available
            let location = await locationManager.getCurrentLocation()

            // Fetch nearby organizations
            organizations = try await supabaseService.fetchNearbyOrganizations(
                latitude: location?.coordinate.latitude ?? 0,
                longitude: location?.coordinate.longitude ?? 0,
                radiusMeters: 50_000
            )
        } catch {
            self.error = error
            print("Failed to load organizations: \(error)")
        }
    }
}

/// Location manager for getting user location
class LocationManager: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocation?, Never>?

    override init() {
        super.init()
        manager.delegate = self
    }

    func getCurrentLocation() async -> CLLocation? {
        // Check authorization
        switch manager.authorizationStatus {
        case .notDetermined:
            manager.requestWhenInUseAuthorization()
        case .denied, .restricted:
            return nil
        default:
            break
        }

        return await withCheckedContinuation { continuation in
            self.continuation = continuation
            manager.requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        continuation?.resume(returning: locations.first)
        continuation = nil
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        continuation?.resume(returning: nil)
        continuation = nil
    }
}

/// Organization card in the discovery feed
struct OrganizationCardView: View {
    let organization: Organization

    @State private var showSlyde = false

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background
                if let imageSrc = organization.homeImageSrc, let url = URL(string: imageSrc) {
                    AsyncImage(url: url) { image in
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    } placeholder: {
                        Rectangle()
                            .fill(SlydesColors.futureBlack)
                    }
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                } else {
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [SlydesColors.leaderBlue, SlydesColors.futureBlack],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }

                // Gradient overlay
                VStack {
                    Spacer()
                    LinearGradient(
                        colors: [.clear, .black.opacity(0.8)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 300)
                }

                // Content
                VStack {
                    Spacer()

                    VStack(alignment: .leading, spacing: SlydesSpacing.sm) {
                        // Business name
                        Text(organization.name)
                            .font(SlydesTypography.title1)
                            .foregroundStyle(.white)

                        // Business type / tagline
                        if let businessType = organization.businessType {
                            Text(businessType.capitalized)
                                .font(SlydesTypography.subheadline)
                                .foregroundStyle(.white.opacity(0.8))
                        }

                        // Slydes count
                        if let slydes = organization.slydes, !slydes.isEmpty {
                            Text("\(slydes.count) experience\(slydes.count == 1 ? "" : "s")")
                                .font(SlydesTypography.caption1)
                                .foregroundStyle(.white.opacity(0.6))
                        }

                        // View button
                        Button {
                            showSlyde = true
                        } label: {
                            HStack {
                                Text("Explore")
                                    .font(SlydesTypography.callout.weight(.semibold))
                                Image(systemName: "arrow.right")
                            }
                            .foregroundStyle(.white)
                            .padding(.horizontal, SlydesSpacing.lg)
                            .padding(.vertical, SlydesSpacing.sm)
                            .background(SlydesColors.primaryGradient)
                            .clipShape(Capsule())
                        }
                        .padding(.top, SlydesSpacing.xs)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(SlydesSpacing.lg)
                    .padding(.bottom, geometry.safeAreaInsets.bottom)
                }
            }
        }
        .ignoresSafeArea()
        .fullScreenCover(isPresented: $showSlyde) {
            OrganizationHomeView(organization: organization)
        }
    }
}

/// Organization home view (shows categories)
struct OrganizationHomeView: View {
    let organization: Organization

    @Environment(\.dismiss) private var dismiss
    @State private var selectedSlyde: Slyde?

    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                Rectangle()
                    .fill(SlydesColors.futureBlack)
                    .ignoresSafeArea()

                ScrollView {
                    LazyVStack(spacing: SlydesSpacing.md) {
                        ForEach(organization.slydes ?? []) { slyde in
                            SlydeRowView(slyde: slyde) {
                                selectedSlyde = slyde
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle(organization.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .fullScreenCover(item: $selectedSlyde) { slyde in
                SlydeView(
                    slyde: slyde,
                    business: nil, // TODO: Convert organization to BusinessInfo
                    faqs: [],
                    onBack: { selectedSlyde = nil }
                )
            }
        }
    }
}

/// Row view for a slyde in the category list
struct SlydeRowView: View {
    let slyde: Slyde
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: SlydesSpacing.md) {
                // Icon
                if let icon = slyde.icon {
                    Text(icon)
                        .font(.title)
                        .frame(width: 50, height: 50)
                        .background(Color.white.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.sm))
                } else {
                    Image(systemName: "sparkles")
                        .font(.title2)
                        .frame(width: 50, height: 50)
                        .background(Color.white.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.sm))
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(slyde.title)
                        .font(SlydesTypography.headline)
                        .foregroundStyle(.white)

                    if let description = slyde.description {
                        Text(description)
                            .font(SlydesTypography.subheadline)
                            .foregroundStyle(.white.opacity(0.6))
                            .lineLimit(2)
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .foregroundStyle(.white.opacity(0.5))
            }
            .padding(SlydesSpacing.md)
            .background(Color.white.opacity(0.05))
            .clipShape(RoundedRectangle(cornerRadius: SlydesRadius.md))
        }
        .buttonStyle(.plain)
    }
}

/// Loading view
struct LoadingView: View {
    var body: some View {
        VStack(spacing: SlydesSpacing.md) {
            ProgressView()
                .scaleEffect(1.5)
            Text("Finding experiences...")
                .font(SlydesTypography.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}

/// Empty state view
struct EmptyStateView: View {
    let title: String
    let message: String
    let systemImage: String

    var body: some View {
        ContentUnavailableView(title, systemImage: systemImage, description: Text(message))
    }
}

#Preview {
    DiscoveryFeedView()
}
