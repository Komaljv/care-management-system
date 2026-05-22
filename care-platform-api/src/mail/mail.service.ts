import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private readonly frontendResetUrl: string;
  private readonly smtpConfigured: boolean;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.from =
      this.configService.get<string>('MAIL_FROM') ||
      'Care Platform <noreply@care-platform.local>';
    this.frontendResetUrl =
      this.configService.get<string>('FRONTEND_RESET_URL') ||
      'http://localhost:3001/reset-password';

    const host = this.configService.get<string>('MAIL_HOST');
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');
    this.smtpConfigured = Boolean(host && user && pass);
  }

  async sendPasswordResetEmail(to: string, token: string, expiresAt: Date): Promise<void> {
    const resetLink = `${this.frontendResetUrl}?token=${encodeURIComponent(token)}`;

    if (!this.smtpConfigured) {
      this.logResetToConsole(to, token, resetLink, expiresAt);
      return;
    }

    try {
      await this.mailerService.sendMail({
        to,
        from: this.from,
        subject: 'Reset your password',
        text: this.buildResetText(resetLink, token, expiresAt),
        html: this.buildResetHtml(resetLink, expiresAt),
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      this.logResetToConsole(to, token, resetLink, expiresAt);
    }
  }

  private logResetToConsole(
    to: string,
    token: string,
    resetLink: string,
    expiresAt: Date,
  ): void {
    this.logger.warn(
      'SMTP not configured (set MAIL_HOST, MAIL_USER, MAIL_PASS). Password reset details logged below.',
    );
    console.log(`\n======================================================`);
    console.log(`[PASSWORD RESET - SMTP NOT CONFIGURED]`);
    console.log(`To: ${to}`);
    console.log(`Reset link: ${resetLink}`);
    console.log(`RESET TOKEN: ${token}`);
    console.log(`EXPIRES AT: ${expiresAt.toISOString()}`);
    console.log(`Or POST /auth/reset-password with token + new password`);
    console.log(`======================================================\n`);
  }

  private buildResetText(resetLink: string, token: string, expiresAt: Date): string {
    return [
      'You requested a password reset for your Care Platform account.',
      '',
      `Reset your password: ${resetLink}`,
      '',
      `If the link does not work, use this token with POST /auth/reset-password:`,
      token,
      '',
      `This link expires at ${expiresAt.toISOString()}.`,
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n');
  }

  private buildResetHtml(resetLink: string, expiresAt: Date): string {
    return `
      <p>You requested a password reset for your Care Platform account.</p>
      <p><a href="${resetLink}">Reset your password</a></p>
      <p>This link expires at ${expiresAt.toISOString()}.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `;
  }
}
