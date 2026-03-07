import { clerkMiddleware, createRouteMatcher  } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);





export default clerkMiddleware( async (auth,req)=>{
    const {userId, orgId} = await auth();

    //allow public routes
    if(isPublicRoute(req)){
        return NextResponse.next();
    }

    //allow org selection route
    if(isOrgSelectionRoute(req)){
        return NextResponse.next();
    }

    //if user is not signed in, redirect to sign in page
    if(!userId){
        await auth.protect()
    }

    //if user is signed in but has not selected an org, redirect to org selection page
    if(userId && !orgId){
        const orgSelection = new URL("/org-selection", req.url);
        return NextResponse.redirect(orgSelection);
    }
    return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};  