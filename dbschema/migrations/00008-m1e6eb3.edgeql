CREATE MIGRATION m1arfib5nkequvukfntcsfru6rmkuqpm534yav6a4frray3n657bea
    ONTO m1oqfhemmbfuqy7dnnlch7vyatr6cjdyxa6d6yigwgexqzwltyffba
{
  CREATE TYPE default::PixelBank {
      CREATE REQUIRED PROPERTY currentPixels: std::int16 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY last_awarded_at: std::datetime;
  };
  ALTER TYPE default::User {
      CREATE LINK bank: default::PixelBank {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::PixelPackages {
      CREATE REQUIRED PROPERTY description: std::str {
          CREATE CONSTRAINT std::max_len_value(200);
      };
      CREATE REQUIRED PROPERTY instantPixels: std::int16 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::max_len_value(50);
      };
      CREATE REQUIRED PROPERTY price: std::int16 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY updated_at: std::datetime;
  };

  UPDATE default::User 
  set {
    bank := (INSERT default::PixelBank {
            currentPixels := 0,
            last_awarded_at := <std::datetime>{'2001-01-01T01:01:01+00'}
        }),
  };
};