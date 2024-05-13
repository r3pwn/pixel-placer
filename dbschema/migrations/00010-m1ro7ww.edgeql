CREATE MIGRATION m1ro7wwp6ucoqzfg4z6gtvovkx4ellrqhex4ps26xtweb47hzricrq
    ONTO m1t3qwv6ez7srxzioh7jo4wd4bcf6yuo6uqyamvtxfgtjd3mwyiulq
{
  ALTER TYPE default::User {
      CREATE ACCESS POLICY logged_in_user_has_access
          ALLOW ALL USING ((.identity ?= GLOBAL ext::auth::ClientTokenIdentity));
  };
};
