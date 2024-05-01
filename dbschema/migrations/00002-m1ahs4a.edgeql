CREATE MIGRATION m1ahs4avzm56spsxkwqpmbpojwgf4pqv5zwvq2xwzka6i24isdsv5a
    ONTO m1jbkm4y44e6nhehi3rzza5kfylv3ymj4iy6vx6fftwae3pj5523fq
{
  CREATE SCALAR TYPE default::Color EXTENDING std::str {
      CREATE CONSTRAINT std::regexp('#[A-Fa-f0-9]{6}');
  };
  CREATE TYPE default::CanvasPixel {
      CREATE REQUIRED PROPERTY x: std::int16 {
          CREATE CONSTRAINT std::max_value(9);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY y: std::int16 {
          CREATE CONSTRAINT std::max_value(9);
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY coord_pair := (((std::to_str(.x) ++ ',') ++ std::to_str(.y)));
      CREATE CONSTRAINT std::exclusive ON (.coord_pair);
      CREATE REQUIRED PROPERTY color: default::Color {
          SET default := '#ffffff';
      };
  };
};
