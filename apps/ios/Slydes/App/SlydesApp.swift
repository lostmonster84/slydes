import SwiftUI

@main
struct SlydesApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}

/// Global app state
@MainActor
class AppState: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?

    let supabaseService = SupabaseService.shared
    let analyticsService = AnalyticsService.shared

    init() {
        Task {
            await restoreSession()
        }
    }

    func restoreSession() async {
        // Check for existing auth session
        if let user = await supabaseService.getCurrentUser() {
            self.currentUser = user
            self.isAuthenticated = true
        }
    }

    func signOut() async {
        await supabaseService.signOut()
        currentUser = nil
        isAuthenticated = false
    }
}

/// User model for authenticated users
struct User: Codable, Identifiable {
    let id: UUID
    let email: String
    let name: String?
    let avatarUrl: String?

    enum CodingKeys: String, CodingKey {
        case id, email, name
        case avatarUrl = "avatar_url"
    }
}
