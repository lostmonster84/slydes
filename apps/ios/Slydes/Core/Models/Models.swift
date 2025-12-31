import Foundation

// MARK: - Enums

/// CTA icon display types
enum CTAIconType: String, Codable {
    case book, call, view, arrow, menu, list
}

/// CTA action types - determines both icon and behavior
enum CTAType: String, Codable {
    case call       // Phone call
    case link       // External URL
    case email      // Email compose
    case directions // Open maps
    case info       // Show info sheet
    case faq        // Show FAQ sheet
    case reviews    // Show reviews
    case frame      // Navigate to frame
    case list       // Show list modal
}

/// Frame template types for editor/runtime semantics
enum TemplateType: String, Codable {
    case hook, how, who, what, proof, trust, action, slydes, custom
}

/// Video filter presets - maps to CSS/Metal filters
enum VideoFilter: String, Codable {
    case original   // No filter
    case cinematic  // contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.05)
    case vintage    // sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)
    case moody      // contrast(1.3) saturate(0.7) brightness(0.85)
    case warm       // sepia(0.15) saturate(1.3) brightness(1.05) contrast(1.05)
    case cool       // hue-rotate(-15deg) saturate(0.9) contrast(1.1)
}

/// Video playback speed presets
enum VideoSpeed: String, Codable {
    case normal     // 1.0x
    case slow       // 0.75x
    case slower     // 0.5x
    case cinematic  // 0.6x

    var rate: Float {
        switch self {
        case .normal: return 1.0
        case .slow: return 0.75
        case .slower: return 0.5
        case .cinematic: return 0.6
        }
    }
}

/// Background media type
enum BackgroundType: String, Codable {
    case video, image, gradient, color
}

/// Review source platforms
enum ReviewSource: String, Codable {
    case google, tripadvisor, facebook, manual, imported
}

/// Property price qualifiers
enum PriceQualifier: String, Codable {
    case asking = "asking"
    case offersOver = "offers_over"
    case offersInRegion = "offers_in_region"
    case fixed = "fixed"
    case poa = "poa"
    case pcm = "pcm"
    case pw = "pw"
}

/// Property types
enum PropertyType: String, Codable {
    case detached, semiDetached = "semi-detached", terraced, flat
    case bungalow, cottage, villa, land, commercial, other
}

/// Property tenure
enum Tenure: String, Codable {
    case freehold, leasehold, shareOfFreehold = "share_of_freehold"
}

/// EPC/Council Tax ratings
enum EnergyRating: String, Codable {
    case A, B, C, D, E, F, G, H
}

// MARK: - Core Models

/// Background configuration for frames
struct BackgroundConfig: Codable {
    let type: BackgroundType
    let src: String?
    let position: String?
    let startTime: Double?
    let filter: VideoFilter?
    let vignette: Bool?
    let speed: VideoSpeed?
    let kenBurns: Bool?

    enum CodingKeys: String, CodingKey {
        case type, src, position
        case startTime = "start_time"
        case filter, vignette, speed
        case kenBurns = "ken_burns"
    }
}

/// Call-to-action configuration
struct CTAConfig: Codable {
    let text: String
    let type: CTAType?
    let value: String?
    let icon: CTAIconType?
    let action: String?
    let listId: String?

    enum CodingKeys: String, CodingKey {
        case text, type, value, icon, action
        case listId = "list_id"
    }
}

/// Info sheet content for a frame
struct FrameInfoContent: Codable {
    let headline: String
    let description: String?
    let items: [String]?
    let highlights: [Highlight]?

    struct Highlight: Codable {
        let icon: String
        let label: String
        let value: String
    }
}

/// Property-specific fields (for property vertical)
struct PropertyInfo: Codable {
    // Actions
    let locationUrl: String?
    let virtualTourUrl: String?
    let floorPlanUrl: String?
    let bookViewingUrl: String?
    let brochureUrl: String?
    let agentPhone: String?
    let applyUrl: String?
    let makeOfferUrl: String?

    // Details
    let price: String?
    let priceQualifier: PriceQualifier?
    let bedrooms: Int?
    let bathrooms: Int?
    let propertyType: PropertyType?
    let sqft: Int?
    let epcRating: EnergyRating?
    let councilTaxBand: EnergyRating?
    let availability: String?
    let parking: String?
    let garden: String?
    let petFriendly: Bool?
    let tenure: Tenure?
    let leaseLength: String?
    let serviceCharge: String?
    let groundRent: String?

    enum CodingKeys: String, CodingKey {
        case locationUrl = "location_url"
        case virtualTourUrl = "virtual_tour_url"
        case floorPlanUrl = "floor_plan_url"
        case bookViewingUrl = "book_viewing_url"
        case brochureUrl = "brochure_url"
        case agentPhone = "agent_phone"
        case applyUrl = "apply_url"
        case makeOfferUrl = "make_offer_url"
        case price
        case priceQualifier = "price_qualifier"
        case bedrooms, bathrooms
        case propertyType = "property_type"
        case sqft
        case epcRating = "epc_rating"
        case councilTaxBand = "council_tax_band"
        case availability, parking, garden
        case petFriendly = "pet_friendly"
        case tenure
        case leaseLength = "lease_length"
        case serviceCharge = "service_charge"
        case groundRent = "ground_rent"
    }
}

/// A single frame within a Slyde
struct Frame: Codable, Identifiable {
    let id: String
    let order: Int
    let templateType: TemplateType?
    let title: String
    let subtitle: String?
    let badge: String?
    let rating: Double?
    let reviewCount: Int?
    let heartCount: Int
    let cta: CTAConfig?
    let background: BackgroundConfig
    let accentColor: String
    let infoContent: FrameInfoContent?
    let slug: String?
    let listItems: [ListItem]?
    let listId: String?
    let inventoryCtaText: String?
    let demoVideoUrl: String?
    let property: PropertyInfo?

    enum CodingKeys: String, CodingKey {
        case id, order
        case templateType = "template_type"
        case title, subtitle, badge, rating
        case reviewCount = "review_count"
        case heartCount = "heart_count"
        case cta, background
        case accentColor = "accent_color"
        case infoContent = "info_content"
        case slug
        case listItems = "list_items"
        case listId = "list_id"
        case inventoryCtaText = "inventory_cta_text"
        case demoVideoUrl = "demo_video_url"
        case property
    }
}

/// An item in a list (menu, inventory, etc.)
struct ListItem: Codable, Identifiable {
    let id: String
    let title: String
    let subtitle: String?
    let image: String?
    let price: String?
    let badge: String?
    let frames: [Frame]?
}

/// A list of items (e.g., "Our Vehicles", "Menu Items")
struct ListData: Codable, Identifiable {
    let id: String
    let name: String
    let items: [ListItem]
}

/// FAQ item
struct FAQItem: Codable, Identifiable {
    let id: String
    let question: String
    let answer: String
    let views: Int?
    let clicks: Int?
    let createdAt: String?
    let updatedAt: String?
    let published: Bool?

    enum CodingKeys: String, CodingKey {
        case id, question, answer, views, clicks
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case published
    }
}

/// Unanswered question from FAQ inbox
struct FAQInboxItem: Codable, Identifiable {
    let id: String
    let question: String
    let categoryId: String
    let askedAt: String
    let searchQuery: String?
    let frameId: String?

    enum CodingKeys: String, CodingKey {
        case id, question
        case categoryId = "category_id"
        case askedAt = "asked_at"
        case searchQuery = "search_query"
        case frameId = "frame_id"
    }
}

/// Customer review
struct Review: Codable, Identifiable {
    let id: String
    let author: String
    let authorLocation: String?
    let rating: Double
    let text: String
    let date: String
    let source: ReviewSource
    let featured: Bool
    let verified: Bool

    enum CodingKeys: String, CodingKey {
        case id, author
        case authorLocation = "author_location"
        case rating, text, date, source, featured, verified
    }
}

/// Social media links
struct SocialLinks: Codable {
    let instagram: String?
    let tiktok: String?
    let facebook: String?
    let youtube: String?
    let twitter: String?
    let linkedin: String?
}

/// Business contact info
struct ContactInfo: Codable {
    let phone: String?
    let email: String?
    let website: String?
    let whatsapp: String?
}

/// Credential/highlight for a business
struct Credential: Codable {
    let icon: String
    let label: String
    let value: String
}

/// Business information (organization profile)
struct BusinessInfo: Codable, Identifiable {
    let id: String
    let name: String
    let tagline: String?
    let location: String
    let rating: Double
    let reviewCount: Int
    let credentials: [Credential]
    let about: String
    let highlights: [String]?
    let contact: ContactInfo
    let social: SocialLinks?
    let image: String?
    let accentColor: String

    enum CodingKeys: String, CodingKey {
        case id, name, tagline, location, rating
        case reviewCount = "review_count"
        case credentials, about, highlights, contact, social, image
        case accentColor = "accent_color"
    }
}

/// Slyde configuration (a category/experience within an organization)
struct SlydeConfig: Codable, Identifiable {
    let id: String
    let slug: String
    let name: String
    let description: String?
    let icon: String?
    let accentColor: String?

    enum CodingKeys: String, CodingKey {
        case id, slug, name, description, icon
        case accentColor = "accent_color"
    }
}

// MARK: - Database Models (Supabase)

/// Organization from database
struct Organization: Codable, Identifiable {
    let id: UUID
    let ownerId: UUID
    let slug: String
    let name: String
    let website: String?
    let businessType: String?
    let logoUrl: String?
    let primaryColor: String?

    // Home screen config
    let homeBackgroundType: BackgroundType?
    let homeImageSrc: String?
    let homeVideoFilter: VideoFilter?
    let homeVideoVignette: Bool?
    let homeVideoSpeed: VideoSpeed?
    let homeVideoStartTime: Double?
    let homeSocialLinks: SocialLinks?

    // Relationships (populated via joins)
    var slydes: [Slyde]?

    enum CodingKeys: String, CodingKey {
        case id
        case ownerId = "owner_id"
        case slug, name, website
        case businessType = "business_type"
        case logoUrl = "logo_url"
        case primaryColor = "primary_color"
        case homeBackgroundType = "home_background_type"
        case homeImageSrc = "home_image_src"
        case homeVideoFilter = "home_video_filter"
        case homeVideoVignette = "home_video_vignette"
        case homeVideoSpeed = "home_video_speed"
        case homeVideoStartTime = "home_video_start_time"
        case homeSocialLinks = "home_social_links"
        case slydes
    }
}

/// Slyde from database
struct Slyde: Codable, Identifiable {
    let id: UUID
    let organizationId: UUID
    let publicId: String
    let title: String
    let description: String?
    let icon: String?
    let orderIndex: Int
    let published: Bool
    let hasInventory: Bool?
    let inventoryCtaText: String?

    // Cover config
    let coverBackgroundType: BackgroundType?
    let coverBackgroundSrc: String?
    let coverVideoFilter: VideoFilter?
    let coverVideoVignette: Bool?
    let coverVideoSpeed: VideoSpeed?

    // Relationships
    var frames: [DatabaseFrame]?

    enum CodingKeys: String, CodingKey {
        case id
        case organizationId = "organization_id"
        case publicId = "public_id"
        case title, description, icon
        case orderIndex = "order_index"
        case published
        case hasInventory = "has_inventory"
        case inventoryCtaText = "inventory_cta_text"
        case coverBackgroundType = "cover_background_type"
        case coverBackgroundSrc = "cover_background_src"
        case coverVideoFilter = "cover_video_filter"
        case coverVideoVignette = "cover_video_vignette"
        case coverVideoSpeed = "cover_video_speed"
        case frames
    }
}

/// Frame from database (snake_case keys)
struct DatabaseFrame: Codable, Identifiable {
    let id: UUID
    let organizationId: UUID
    let slydeId: UUID
    let publicId: String
    let frameIndex: Int
    let templateType: TemplateType?
    let title: String?
    let subtitle: String?
    let badge: String?
    let ctaText: String?
    let ctaAction: String?
    let ctaType: CTAType?
    let ctaIcon: CTAIconType?
    let backgroundType: BackgroundType?
    let backgroundGradient: String?
    let backgroundColor: String?
    let videoFilter: VideoFilter?
    let videoVignette: Bool?
    let videoSpeed: VideoSpeed?
    let accentColor: String?
    let demoVideoUrl: String?
    let listId: UUID?
    let listItemId: UUID?

    enum CodingKeys: String, CodingKey {
        case id
        case organizationId = "organization_id"
        case slydeId = "slyde_id"
        case publicId = "public_id"
        case frameIndex = "frame_index"
        case templateType = "template_type"
        case title, subtitle, badge
        case ctaText = "cta_text"
        case ctaAction = "cta_action"
        case ctaType = "cta_type"
        case ctaIcon = "cta_icon"
        case backgroundType = "background_type"
        case backgroundGradient = "background_gradient"
        case backgroundColor = "background_color"
        case videoFilter = "video_filter"
        case videoVignette = "video_vignette"
        case videoSpeed = "video_speed"
        case accentColor = "accent_color"
        case demoVideoUrl = "demo_video_url"
        case listId = "list_id"
        case listItemId = "list_item_id"
    }

    /// Convert to Frame model for UI consumption
    func toFrame() -> Frame {
        Frame(
            id: id.uuidString,
            order: frameIndex,
            templateType: templateType,
            title: title ?? "",
            subtitle: subtitle,
            badge: badge,
            rating: nil,
            reviewCount: nil,
            heartCount: 0,
            cta: ctaText != nil ? CTAConfig(
                text: ctaText!,
                type: ctaType,
                value: ctaAction,
                icon: ctaIcon,
                action: ctaAction,
                listId: listId?.uuidString
            ) : nil,
            background: BackgroundConfig(
                type: backgroundType ?? .image,
                src: nil, // TODO: Resolve from media attachments
                position: nil,
                startTime: nil,
                filter: videoFilter,
                vignette: videoVignette,
                speed: videoSpeed,
                kenBurns: nil
            ),
            accentColor: accentColor ?? "bg-blue-600",
            infoContent: nil,
            slug: nil,
            listItems: nil,
            listId: listId?.uuidString,
            inventoryCtaText: nil,
            demoVideoUrl: demoVideoUrl,
            property: nil
        )
    }
}
