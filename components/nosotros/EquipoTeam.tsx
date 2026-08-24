"use client";

import { useEffect, useState } from "react";
import Editable from "@/components/admin/Editable";
import type { Member } from "@/lib/content";
import { DEFAULT_EQUIPO } from "@/lib/content";
import { useScrollToHash } from "@/lib/useScrollToHash";

/* VISTA PREVIA (rama equipo-fotos-preview): muestra solo las fotos del equipo,
 * sin nombres ni cargos, para evaluar cómo lucen en el diseño. */
export default function EquipoTeam() {
  const [members, setMembers] = useState<Member[]>(DEFAULT_EQUIPO);

  useEffect(() => {
    let alive = true;
    fetch("/api/content/equipo")
      .then((r) => r.json())
      .then((d) => {
        if (alive && Array.isArray(d) && d.length) setMembers(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useScrollToHash(members);

  return (
    <section className="atg-band" id="equipo">
      <div className="atg-wrap">
        <div className="reveal" style={{ maxWidth: "46rem", margin: "0 auto 40px", textAlign: "center" }}>
          <Editable as="h2" id="equipo.lead-title">Quienes orientan nuestra gestión</Editable>
        </div>

        <div className="eq-grid reveal">
          {members.map((m) => (
            <div id={m.id} key={m.id} className="eq-member eq-member-photoonly">
              <div className="eq-member-photo">
                {m.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt="" loading="lazy" decoding="async" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
