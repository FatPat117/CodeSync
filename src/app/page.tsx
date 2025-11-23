import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
const HomePage = () => {
        return (
                <div className="m-10">
                        <SignedOut>
                                <SignInButton />
                        </SignedOut>

                        <SignedIn>
                                <UserButton />
                        </SignedIn>
                </div>
        );
};

export default HomePage;
