import axios from "axios";

export type CodilitySession = {
  url: string;
  id: string;
  testName: string;
  candidate: string;
  first_name: string;
  last_name: string;
  email: string;
  create_date: Date;
  start_date: Date;
  close_date: Date;
  campaign_url: string;
};

export type CodilitySessionResult = {
  id: string;
  evaluation: {
    tasks: [
      {
        task_name: string;
        result: string;
        max_result: number;
        prg_lang: string;
        name: string;
      }
    ];
    max_result: number;
    result: string;
  };
};

export type CodilityTest = {
  id: number;
  name: string;
  totalNumberOfTasks: number;
  possibleTotalScore: number;
};

export type CodilityTestSession = {
  id: string;
  testLink: string;
  sessionUrl: string;
};

export class CodilityService {
  private token: string;

  constructor(private host: string, token: string) {
    this.token = encodeURIComponent(token);
  }

  async getSessions(email: string) {
    const url = `https://${
      this.host
    }/api/management/recruitment/candidates/${encodeURIComponent(
      email
    )}/sessions?code=${this.token}`;
    const result = await axios.get(url);
    if (result.status !== 200) {
      return null;
    }
    const data: CodilitySession[] = await result.data;
    return data;
  }

  async getSessionResult(id: string) {
    const url = `https://${
      this.host
    }/api/management/recruitment/candidates/sessions/${encodeURIComponent(
      id
    )}?code=${this.token}`;
    const result = await axios.get(url);
    if (result.status !== 200) {
      return null;
    }
    const data: CodilitySessionResult = await result.data;
    return data;
  }

  async getTests() {
    const url = `https://${this.host}/api/management/recruitment/tests/active?code=${this.token}`;
    const result = await axios.get(url);
    if (result.status !== 200) {
      return null;
    }
    const data: CodilityTest[] = await result.data;
    return data;
  }

  async createTestSession(
    test: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    const url = `https://${
      this.host
    }/api/management/recruitment/tests/${encodeURIComponent(
      test
    )}/invite?code=${this.token}`;
    const result = await axios.post(url, {
      email,
      firstName,
      lastName,
      testId: test,
    });
    if (result.status !== 200) {
      return null;
    }
    const data: CodilityTestSession = await result.data;
    return data;
  }
}
