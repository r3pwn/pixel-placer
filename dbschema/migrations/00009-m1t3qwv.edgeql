CREATE MIGRATION m1t3qwv6ez7srxzioh7jo4wd4bcf6yuo6uqyamvtxfgtjd3mwyiulq
    ONTO m1arfib5nkequvukfntcsfru6rmkuqpm534yav6a4frray3n657bea
{
  ALTER TYPE default::User {
      ALTER LINK bank {
          SET REQUIRED USING (std::assert_exists(.bank));
      };
  };
};
