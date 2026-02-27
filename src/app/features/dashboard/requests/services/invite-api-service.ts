import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserStore } from 'src/app/core/stores/user-store';
import { AcceptReject, EventsApi, Invite, JoinRequestsApiResp, myRequestsApiResp, ProcessRequestApi, ProcessRequestApiResp, Requests } from '../models/requests.model';

@Injectable({
  providedIn: 'root'
})
export class InviteApiService {
  private readonly api = inject(ApiService);
  private readonly userStore = inject(UserStore);
  private readonly commonService = inject(CommonService);
  private readonly current = this.userStore.getCurrent();

  getMyRequests(page = 0, size = 5): Observable<myRequestsApiResp> {
    const obj: EventsApi = {
      userId: this.current()!.userID,
      page,
      size,
    }
    return this.api.post<EventsApi, myRequestsApiResp>(`eventApproval/myRequestedEvents`, obj)
      .pipe(
        map((response: myRequestsApiResp) =>
        ({
          ...response,
          requestedEvents: this.commonService.updateEventProfileImage(
            response.requestedEvents,
            true
          ),
        }))
      );
  }

  getJoinRequests(page = 0, size = 5): Observable<JoinRequestsApiResp> {
    const obj = {
      eventCreatorUserId: this.current()!.userID,
      page,
      size,
    }
    return this.api.post<any, JoinRequestsApiResp>(`eventApproval/myEventsRequestsReceived`, obj)
      .pipe(
        map((response: JoinRequestsApiResp) => ({
          ...response,
          receivedRequests: this.commonService.updateEventProfileImage(
            (response.receivedRequests.filter(x => x.status !== AcceptReject.Accepted) || []),
            false
          ),
        }))
      );
  }

  ProcessJoinRequests(detail: Requests, isAccepted: boolean): Observable<ProcessRequestApiResp> {
    const obj: ProcessRequestApi = {
      approvalId: detail.approvalId,
      eventCreatorId: this.current()!.userID,
      action: isAccepted ? AcceptReject.Accepted : AcceptReject.Rejected
    }
    return this.api.post<any, ProcessRequestApiResp>(`eventApproval/processRequest`, obj)
  }

  fetchNearby(lat: number, lng: number) { return this.api.get<Invite[]>(`/api/requests/near?lat=${lat}&lng=${lng}`); }
  fetchById(id: string) { return this.api.get<Invite>(`/api/requests/${id}`); }
  // createInvite(payload: Partial<Invite>) { return this.api.post<Invite>('/api/invites', payload); }
  joinInvite(id: string, uid: string) { return this.api.post(`/api/requests/${id}/join`, { uid }); }
  leaveInvite(id: string, uid: string) { return this.api.post(`/api/requests/${id}/leave`, { uid }); }

}
