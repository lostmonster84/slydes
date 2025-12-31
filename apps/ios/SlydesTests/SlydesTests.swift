import XCTest
@testable import Slydes

final class SlydesTests: XCTestCase {

    func testVideoFilterSpeedRates() {
        XCTAssertEqual(VideoSpeed.normal.rate, 1.0)
        XCTAssertEqual(VideoSpeed.slow.rate, 0.75)
        XCTAssertEqual(VideoSpeed.slower.rate, 0.5)
        XCTAssertEqual(VideoSpeed.cinematic.rate, 0.6)
    }

    func testDeepLinkParsing() {
        // Home link
        let homeUrl = URL(string: "https://slydes.io/wildtrax")!
        if case .home(let slug) = DeepLink.parse(url: homeUrl) {
            XCTAssertEqual(slug, "wildtrax")
        } else {
            XCTFail("Expected home deep link")
        }

        // Slyde link
        let slydeUrl = URL(string: "https://slydes.io/wildtrax/camping")!
        if case .slyde(let slug, let slydeId) = DeepLink.parse(url: slydeUrl) {
            XCTAssertEqual(slug, "wildtrax")
            XCTAssertEqual(slydeId, "camping")
        } else {
            XCTFail("Expected slyde deep link")
        }

        // Frame link with query param
        let frameUrl = URL(string: "https://slydes.io/wildtrax/camping?frame=3")!
        if case .frame(let slug, let slydeId, let frameIndex) = DeepLink.parse(url: frameUrl) {
            XCTAssertEqual(slug, "wildtrax")
            XCTAssertEqual(slydeId, "camping")
            XCTAssertEqual(frameIndex, 3)
        } else {
            XCTFail("Expected frame deep link")
        }
    }

    func testColorHexInitialization() {
        let color = Color(hex: "2563EB")
        XCTAssertNotNil(color)
    }

    func testCTATypeDecoding() throws {
        let json = """
        {
            "text": "Book Now",
            "type": "link",
            "value": "https://example.com"
        }
        """
        let data = json.data(using: .utf8)!
        let decoded = try JSONDecoder().decode(CTAConfig.self, from: data)

        XCTAssertEqual(decoded.text, "Book Now")
        XCTAssertEqual(decoded.type, .link)
        XCTAssertEqual(decoded.value, "https://example.com")
    }
}
