import Foundation

/// App configuration
/// TODO: Move to environment-based configuration for production
enum Config {
    // MARK: - Supabase

    /// Supabase project URL
    static let supabaseUrl = "https://sttcvppjadfbhirnuebb.supabase.co"

    /// Supabase anonymous key (safe for client-side)
    static let supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dGN2cHBqYWRmYmhpcm51ZWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjYxMjIsImV4cCI6MjA4MTIwMjEyMn0.nui04vQntf-_go-XbF4_kcfgPj3qY3uN1140x_viIe4"

    // MARK: - Cloudflare

    /// Cloudflare Stream account hash for HLS URLs
    static let cloudflareAccountHash = "your-account-hash"

    // MARK: - URLs

    /// Base URL for share links
    static let baseUrl = "https://slydes.io"

    /// API base URL
    static let apiBaseUrl = "\(supabaseUrl)/rest/v1"

    // MARK: - Feature Flags

    /// Enable analytics tracking
    static let analyticsEnabled = true

    /// Enable debug logging
    #if DEBUG
    static let debugLogging = true
    #else
    static let debugLogging = false
    #endif
}
