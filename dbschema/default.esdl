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
    required bank: PixelBank {
      constraint exclusive;
    };

    access policy allow_create
      allow insert;
    access policy logged_in_user_has_access 
      allow all using (
        .identity ?= global ext::auth::ClientTokenIdentity
      )
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
    required updated_at: datetime;

    constraint exclusive on ((.x, .y));
    index on (.updated_at);
  }

  type PixelBank {
    required currentPixels: int16 {
      constraint min_value(0);
      default := 0;
    }

    required last_awarded_at: datetime;
  }

  type PixelPackages {
    required name: str {
      constraint max_len_value(50)
    }
    required description: str {
      constraint max_len_value(200)
    }
    required price: int16 {
      constraint min_value(0)
    }
    required instantPixels: int16 {
      constraint min_value(0)
    }

    required updated_at: datetime;
  }
}