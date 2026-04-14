"use client";

import type { OrganizationRole } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-shadcn/ui/select";

interface WorkspaceMemberInviteDialogProps {
  readonly open: boolean;
  readonly email: string;
  readonly role: OrganizationRole;
  readonly submitting: boolean;
  readonly editableRoles: readonly OrganizationRole[];
  readonly onOpenChange: (open: boolean) => void;
  readonly onEmailChange: (value: string) => void;
  readonly onRoleChange: (role: OrganizationRole) => void;
  readonly onSubmit: () => void;
}

export function WorkspaceMemberInviteDialog({
  open,
  email,
  role,
  submitting,
  editableRoles,
  onOpenChange,
  onEmailChange,
  onRoleChange,
  onSubmit,
}: WorkspaceMemberInviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>邀請成員</DialogTitle>
          <DialogDescription>輸入電子信箱以邀請新成員加入此工作區所屬組織。</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="workspace-invite-email">電子信箱</Label>
            <Input id="workspace-invite-email" type="email" placeholder="member@example.com" value={email} onChange={(event) => onEmailChange(event.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="workspace-invite-role">角色</Label>
            <Select value={role} onValueChange={(value) => onRoleChange(value as OrganizationRole)}>
              <SelectTrigger id="workspace-invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {editableRoles.map((editableRole) => <SelectItem key={editableRole} value={editableRole}>{editableRole}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={onSubmit} disabled={submitting || !email.trim()}>
            {submitting ? "邀請中…" : "送出邀請"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
