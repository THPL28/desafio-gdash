import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: SignupDto): Promise<import("../users/user.schema").User>;
    login(req: any): Promise<{
        access_token: string;
    }>;
}
