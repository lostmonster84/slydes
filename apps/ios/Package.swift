// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Slydes",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "Slydes",
            targets: ["Slydes"]
        ),
    ],
    dependencies: [
        // Supabase Swift SDK - backend client
        .package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0"),
        // Nuke - image loading and caching
        .package(url: "https://github.com/kean/Nuke", from: "12.0.0"),
        // KeychainAccess - secure credential storage
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess", from: "4.2.0"),
    ],
    targets: [
        .target(
            name: "Slydes",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift"),
                .product(name: "NukeUI", package: "Nuke"),
                .product(name: "KeychainAccess", package: "KeychainAccess"),
            ],
            path: "Slydes"
        ),
        .testTarget(
            name: "SlydesTests",
            dependencies: ["Slydes"],
            path: "SlydesTests"
        ),
    ]
)
