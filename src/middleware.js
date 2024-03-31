import jwt from 'jsonwebtoken';
export function middleware(req) {

    // Get the token from the request headers or cookies, depending on your setup
    const token = req.cookies.get('storeToken')?.value
    if(token){
      try {
        // Decode the token to access its payload
        const decoded = jwt.decode(token);

        // Check if the token has expired
        if (decoded.exp < Date.now() / 1000) {
          return Response.redirect(new URL('/login', req.url))
          
        }

        // Token is valid, proceed with the request
        return Response.redirect(new URL(req.nextUrl.pathname, req.url))
      } catch (error) {
        // Token decoding failed, handle error (e.g., redirect to login page)
        return Response.redirect(new URL('/login', req.url))
      }
    }

    
  };


// export const config = { matcher: ['/:path*'] }

