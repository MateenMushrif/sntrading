import { NextRequest, NextResponse } from "next/server";

interface UpdateParams {
    target: string;
    version: string;
}

// UPDATE THIS TO YOUR ACTUAL GITHUB REPO WHEN YOU DEPLOY: "owner/repo"
const GITHUB_REPO = process.env.TAURI_GITHUB_REPO || "YOUR_GITHUB_USERNAME/sntrading-admin";

// PUBLIC: Desktop app auto-update checker for Tauri
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<UpdateParams> }
) {
    try {
        const { target, version } = await params;

        console.log(`[UPDATE CHECK] Request -> target: "${target}", client version: "${version}"`);

        // Target platform validation for Windows 64-bit
        const isWindows =
            target === "windows-x86_64" ||
            target === "x86_64-pc-windows-msvc" ||
            target.includes("windows");

        if (!isWindows) {
            console.log("[UPDATE CHECK] Unsupported target platform.");
            return new NextResponse(null, { status: 204 });
        }

        const host = req.headers.get("host") || "localhost:3000";
        const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

        // FOOLPROOF LOCAL CHECK: Checks process env OR IP addresses
        const isLocal =
            process.env.NODE_ENV === "development" ||
            host.includes("localhost") ||
            host.includes("127.0.0.1") ||
            host.includes("::1");

        // ------------------------------------------------------------------
        // 1. LOCAL DEV BRANCH (npm run dev)
        // ------------------------------------------------------------------
        if (isLocal) {
            const LATEST_VERSION = "0.2.0";

            if (version === LATEST_VERSION) {
                console.log("[UPDATE CHECK - LOCAL] Client is already up to date.");
                return new NextResponse(null, { status: 204 });
            }

            console.log(`[UPDATE CHECK - LOCAL] Offering update ${LATEST_VERSION} to client on ${version}`);

            const downloadUrl = `${protocol}://${host}/sntrading-admin_${LATEST_VERSION}_x64-setup.exe`;

            return NextResponse.json(
                {
                    version: LATEST_VERSION,
                    notes: "v0.2.0 Release Highlights:\n• Added customizable themes\n• Resolved database connection timeout\n• Optimized background sync speed",
                    pub_date: new Date().toISOString(),
                    signature: "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVSMUc2cFZ4QW82YjVvVUV3L3pyakhTOXF0VTFaYlRQcUlvODRQamVtWE1POGZyQ0J6cUY1elU1N2dWeFd6K3ZZOHdqbzJkRTdYeSttblRXaE1JUXJCY20rR3ExckxhaXd3PQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzg1NTk0MTM3CWZpbGU6c250cmFkaW5nLWFkbWluXzAuMi4wX3g2NC1zZXR1cC5leGUKZ0F5d3BraTFQOWNkeG9xR0dlZkU4UmQyY090eEZKSklPQ3NISlNCWExwUTFNNHk3c3ViMHN4cmhkTmIyUVBCcUw5NVVtc0Z3OTl4cHgvdG4xaU9kQnc9PQo=",
                    url: downloadUrl,
                },
                { status: 200 }
            );
        }

        // ------------------------------------------------------------------
        // 2. PRODUCTION BRANCH (Vercel deployment)
        // ------------------------------------------------------------------
        const githubRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
            {
                headers: { "User-Agent": "Tauri-Updater" },
                next: { revalidate: 60 }
            }
        );

        if (!githubRes.ok) {
            console.error("[UPDATE CHECK - PROD] Failed to fetch GitHub release.");
            return new NextResponse(null, { status: 204 });
        }

        const release = await githubRes.json();
        const latestTag = release.tag_name.replace(/^v/, "");

        if (version === latestTag) {
            return new NextResponse(null, { status: 204 });
        }

        const exeAsset = release.assets?.find((a: { name: string }) => a.name.endsWith(".exe"));
        const sigAsset = release.assets?.find((a: { name: string }) => a.name.endsWith(".sig"));

        if (!exeAsset || !sigAsset) {
            console.error("[UPDATE CHECK - PROD] Missing required assets (.exe or .sig) in GitHub release.");
            return new NextResponse(null, { status: 204 });
        }

        const sigTextRes = await fetch(sigAsset.browser_download_url);
        const signatureText = await sigTextRes.text();

        return NextResponse.json(
            {
                version: latestTag,
                notes: release.body || `Version ${latestTag} updates.`,
                pub_date: release.published_at,
                signature: signatureText.trim(),
                url: exeAsset.browser_download_url,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("[UPDATE CHECK ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error during update resolution." },
            { status: 500 }
        );
    }
}