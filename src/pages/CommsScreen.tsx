import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneFrame } from '../components/PhoneFrame';
import { NearbyMapPanel } from '../components/NearbyMapPanel';
import { PttPanel } from '../components/PttPanel';
import { IncidentDetailSheet } from '../components/IncidentDetailSheet';
import { Pill, Segmented } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { nearbyIncidents } from '../data/app';

type CommsTab = 'map' | 'radio';

export function CommsScreen() {
  const { dark, sosActive, commsTab, setCommsTab } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [respondingIds, setRespondingIds] = useState<string[]>([]);

  const selected = useMemo(
    () => nearbyIncidents.find((i) => i.id === selectedId) ?? null,
    [selectedId]
  );
  const urgent = nearbyIncidents.filter((i) => i.severity !== 'minor').length;

  return (
    <PhoneFrame
      title="Comms"
      headerRight={
      <span className="pb-1.5">
          {commsTab === 'map' ?
        <Pill tone={urgent > 0 ? 'red' : 'green'} dot glow>
              {urgent} needing help
            </Pill> :

        <Pill tone={sosActive ? 'red' : 'green'} dot glow>
              {sosActive ? 'Channel locked' : 'Open channel'}
            </Pill>
        }
        </span>
      }
      overlay={
      <IncidentDetailSheet
        incident={selected}
        responding={selected ? respondingIds.includes(selected.id) : false}
        onRespond={() =>
        selected &&
        setRespondingIds((ids) =>
        ids.includes(selected.id) ?
        ids.filter((i) => i !== selected.id) :
        [...ids, selected.id]
        )
        }
        onClose={() => setSelectedId(null)} />

      }>
      
      <div className="px-4 pb-3 pt-1">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <Segmented<CommsTab>
            ariaLabel="Communications view"
            value={commsTab}
            onChange={setCommsTab}
            options={[
              { value: 'map', label: 'Nearby Map' },
              { value: 'radio', label: 'Radio & Chat' },
            ]}
          />
        </motion.div>
      </div>

      {commsTab === 'map' ?
      <NearbyMapPanel
        dark={dark}
        selectedId={selectedId}
        respondingIds={respondingIds}
        onSelect={setSelectedId} /> :


      <PttPanel />
      }
    </PhoneFrame>);

}