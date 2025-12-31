import Foundation
import Supabase

/// Supabase backend service
/// Handles all database queries and auth operations
@MainActor
class SupabaseService {
    static let shared = SupabaseService()

    let client: SupabaseClient

    private init() {
        client = SupabaseClient(
            supabaseURL: URL(string: Config.supabaseUrl)!,
            supabaseKey: Config.supabaseAnonKey
        )
    }

    // MARK: - Organizations

    /// Fetch organization by slug (for direct Slyde links)
    func fetchOrganization(slug: String) async throws -> Organization? {
        let response: Organization = try await client
            .from("organizations")
            .select("*, slydes(*)")
            .eq("slug", slug)
            .single()
            .execute()
            .value
        return response
    }

    /// Fetch nearby organizations for discovery feed
    func fetchNearbyOrganizations(
        latitude: Double,
        longitude: Double,
        radiusMeters: Double = 50_000
    ) async throws -> [Organization] {
        // TODO: Implement PostGIS RPC once endpoint is created
        // For now, fetch all published organizations
        let response: [Organization] = try await client
            .from("organizations")
            .select("*")
            .execute()
            .value
        return response
    }

    // MARK: - Slydes

    /// Fetch a single Slyde with all frames
    func fetchSlyde(organizationId: UUID, publicId: String) async throws -> Slyde? {
        let response: Slyde = try await client
            .from("slydes")
            .select("*, frames(*)")
            .eq("organization_id", organizationId)
            .eq("public_id", publicId)
            .eq("published", true)
            .single()
            .execute()
            .value
        return response
    }

    /// Fetch all published Slydes for an organization
    func fetchSlydes(organizationId: UUID) async throws -> [Slyde] {
        let response: [Slyde] = try await client
            .from("slydes")
            .select("*")
            .eq("organization_id", organizationId)
            .eq("published", true)
            .order("order_index", ascending: true)
            .execute()
            .value
        return response
    }

    // MARK: - FAQs

    /// Fetch FAQs for an organization (home-level) or specific Slyde
    func fetchFAQs(organizationId: UUID, slydeId: UUID? = nil) async throws -> [FAQItem] {
        var query = client
            .from("faqs")
            .select("*")
            .eq("organization_id", organizationId)
            .eq("published", true)
            .order("faq_index", ascending: true)

        if let slydeId = slydeId {
            query = query.eq("slyde_id", slydeId)
        }

        let response: [FAQItem] = try await query.execute().value
        return response
    }

    // MARK: - Auth

    /// Get current authenticated user
    func getCurrentUser() async -> User? {
        do {
            let session = try await client.auth.session
            let authUser = session.user

            return User(
                id: authUser.id,
                email: authUser.email ?? "",
                name: nil,
                avatarUrl: nil
            )
        } catch {
            return nil
        }
    }

    /// Sign in with email/password
    func signIn(email: String, password: String) async throws -> User {
        let session = try await client.auth.signIn(email: email, password: password)
        let authUser = session.user

        return User(
            id: authUser.id,
            email: authUser.email ?? "",
            name: nil,
            avatarUrl: nil
        )
    }

    /// Sign out
    func signOut() async {
        do {
            try await client.auth.signOut()
        } catch {
            print("Sign out error: \(error)")
        }
    }
}
