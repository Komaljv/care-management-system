import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MAIL_HOST');
        const port = Number(configService.get<string>('MAIL_PORT') || 587);
        const user = configService.get<string>('MAIL_USER');
        const pass = configService.get<string>('MAIL_PASS');
        const secure = configService.get<string>('MAIL_SECURE') === 'true';

        return {
          transport: host
            ? {
                host,
                port,
                secure,
                auth: user && pass ? { user, pass } : undefined,
              }
            : {
                // Placeholder when SMTP is not configured; MailService falls back to console
                jsonTransport: true,
              },
          defaults: {
            from:
              configService.get<string>('MAIL_FROM') ||
              'Care Platform <noreply@care-platform.local>',
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
