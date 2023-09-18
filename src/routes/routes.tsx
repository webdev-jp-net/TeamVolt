import { FC, useMemo } from 'react';

import { useSelector } from 'react-redux';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from 'components/layout/Layout';
import { RootState } from 'store';

import { EnergyCharge } from 'components/pages/EnergyCharge';
import { Home } from 'components/pages/Home';
import { TargetLead } from 'components/pages/TargetLead';
import { TeamUp } from 'components/pages/TeamUp';
import { WaitingRoom } from 'components/pages/WaitingRoom';

export const App: FC = () => {
  const { myTeam } = useSelector((state: RootState) => state.player);

  const hasMyTeam = useMemo(() => !!myTeam, [myTeam]);
  const hasChallenger = useMemo(() => !!myTeam?.challenger, [myTeam]);
  const hasChargeUnit = useMemo(() => !!myTeam?.chargeUnits?.length, [myTeam]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/team-up" element={<TeamUp />} />
          <Route
            path="/waiting-room"
            element={hasMyTeam ? <WaitingRoom /> : <Navigate to="/team-up" replace />}
          />
          <Route
            path="/energy-charge"
            element={hasChallenger ? <EnergyCharge /> : <Navigate to="/team-up" replace />}
          />
          <Route
            path="/target-lead"
            element={hasChargeUnit ? <TargetLead /> : <Navigate to="/team-up" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
