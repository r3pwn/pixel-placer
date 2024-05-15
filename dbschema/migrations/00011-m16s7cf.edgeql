CREATE MIGRATION m16s7cfi3s4viw4pouzuej3im6fp6l7mpuhm4io7o5t7kmlccylrya
    ONTO m1ro7wwp6ucoqzfg4z6gtvovkx4ellrqhex4ps26xtweb47hzricrq
{
  ALTER TYPE default::User {
      CREATE ACCESS POLICY allow_create
          ALLOW INSERT ;
  };
};
