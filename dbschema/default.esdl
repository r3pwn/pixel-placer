using extension auth;

module default {
  global currentUser := (
    select User
    filter .identity ?= global ext::auth::ClientTokenIdentity
  );

  scalar type Color extending str {
    constraint regexp(r'#[A-Fa-f0-9]{6}');
  }

  type User {
    required name: str;
    required identity: ext::auth::Identity;
  }

  type CanvasPixel {
    required x: int16 {
      constraint min_value(0);
      constraint max_value(999);
    }
    required y: int16 {
      constraint min_value(0);
      constraint max_value(999);
    }
    required color: Color {
      default := "#ffffff"
    }

    constraint exclusive on ((.x, .y));
  }
}