import PolicyLayout from "@/components/PolicyLayout";

export default function CookiesPage() {
    return (
        <PolicyLayout
            title="Cookie Policy"
            content={
                <>
                    <p>
                        This Cookie Policy explains how Ravonixx ("we", "us", and "our") uses cookies and similar technologies 
                        to recognize you when you visit our website. It explains what these technologies are and why we use them, 
                        as well as your rights to control our use of them.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-6">1. What are cookies?</h2>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                        Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
                        as well as to provide reporting information.
                    </p>
                    <p>
                        Cookies set by the website owner (in this case, Ravonixx) are called "first-party cookies". 
                        Cookies set by parties other than the website owner are called "third-party cookies". 
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-6">2. Why do we use cookies?</h2>
                    <p>
                        We use first-party cookies for several reasons. Some cookies are required for technical reasons in order 
                        for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
                        Specifically, we use cookies to:
                    </p>
                    <ul className="list-disc pl-6 space-y-4">
                        <li><strong className="text-white">Authenticate Users:</strong> Maintain your session after you log in using Discord OAuth2, ensuring you stay securely logged in.</li>
                        <li><strong className="text-white">Save Preferences:</strong> Remember your website settings, like theme modes (dark/light) or dashboard preferences.</li>
                        <li><strong className="text-white">Security:</strong> Protect your account from unauthorized access.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-6">3. How can I control cookies?</h2>
                    <p>
                        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser 
                        controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though 
                        your access to some functionality and areas of our website (such as the logged-in dashboard) may be restricted.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mt-12 mb-6">4. How often will you update this Cookie Policy?</h2>
                    <p>
                        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies 
                        we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy 
                        regularly to stay informed about our use of cookies and related technologies.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-6">5. Where can I get further information?</h2>
                    <p>
                        If you have any questions about our use of cookies or other technologies, please open a support ticket 
                        in our official Discord server or contact us.
                    </p>
                </>
            }
        />
    );
}
