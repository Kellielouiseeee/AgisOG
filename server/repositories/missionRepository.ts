import { db } from '../db/json-adapter';
import { Mission } from '../models/types';

export class MissionRepository {
  static async findByUserId(userId: string): Promise&lt;Mission[]&gt; {
    return db.getMissions(userId);
  }

  static async save(mission: Mission): Promise&lt;void&gt; {
    return db.saveMission(mission);
  }

  static async findById(userId: string, missionId: string): Promise&lt;Mission | undefined&gt; {
    const missions = await this.findByUserId(userId);
    return missions.find(m =&gt; m.id === missionId);
  }
}
