CREATE MIGRATION m1h5bqlcu4exnhtsm6kbtd6zl24k3kzkmlbkfllmi4nsxyz6t2uunq
    ONTO m1xjbtia727veldjmhkoziznazndm23gjuaclm3wfywy2hucvgcola
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE GLOBAL default::currentUser := (SELECT
      default::User
  FILTER
      (.identity ?= GLOBAL ext::auth::ClientTokenIdentity)
  );
};
