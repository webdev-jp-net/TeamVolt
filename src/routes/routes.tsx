import { FC } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from 'components/layout/Layout';

import { EnergyCharge } from 'components/pages/EnergyCharge';
import { Home } from 'components/pages/Home';
import { TargetLead } from 'components/pages/TargetLead';
import { TeamUp } from 'components/pages/TeamUp';
import { WaitingRoom } from 'components/pages/WaitingRoom';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/team-up" element={<TeamUp />} />
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route path="/energy-charge" element={<EnergyCharge />} />
          <Route path="/target-lead" element={<TargetLead />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
