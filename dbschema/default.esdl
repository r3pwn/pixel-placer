module default {
  scalar type Color extending str {
    constraint regexp(r'#[A-Fa-f0-9]{6}');
  }
  type CanvasPixel {
    required x: int16 {
      constraint min_value(0);
      constraint max_value(9);
    }
    required y: int16 {
      constraint min_value(0);
      constraint max_value(9);
    }
    required coord_pair := to_str(.x) ++ ',' ++ to_str(.y);
    required color: Color {
      default := "#ffffff"
    }

    constraint exclusive on (.coord_pair);
  }
}